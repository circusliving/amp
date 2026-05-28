#!/usr/bin/env bash
# deploy.sh — ship the circusliving Nuxt app to the personal-infra swarm.
#
# Usage:
#   scripts/deploy.sh <env>            # env = dev | stg | prod
#   scripts/deploy.sh dev IMAGE_TAG=dev-abc1234   # override any env var
#
# Mechanics:
#   1. Sources deploy/<env>.env (the deploy contract).
#   2. Locates the running EC2 manager via tags Project=personal-infra,
#      Role=swarm-manager.
#   3. Base64-encodes deploy/docker-compose.swarm.yml.
#   4. Uses SSM Run Command (AWS-RunShellScript) to land the compose on
#      the manager and run `docker stack deploy circusliving-<env>` with
#      the env vars interpolated.
#   5. Polls invocation status; on failure prints StandardErrorContent.
#
# Required env / context:
#   AWS_REGION   defaults to us-east-1
#   AWS_PROFILE  optional; honored if exported (e.g. via aws-vault)
#
# Required AWS permissions:
#   ec2:DescribeInstances
#   ssm:SendCommand            (on AWS-RunShellScript + the manager)
#   ssm:GetCommandInvocation

set -euo pipefail
IFS=$'\n\t'

AWS_REGION="${AWS_REGION:-us-east-1}"
export AWS_REGION

VALID_ENVS=(dev stg prod)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

log() { printf '[deploy] %s\n' "$*"; }
err() { printf '[deploy] %s\n' "$*" >&2; }

usage() {
  cat <<EOF
Usage: scripts/deploy.sh <env> [KEY=value ...]

  env   one of: ${VALID_ENVS[*]}

Sources deploy/<env>.env for STACK_HOSTNAME / IMAGE_TAG / DATO_SECRET_NAME
etc. Any KEY=value args after <env> override what was sourced (useful
for pinning IMAGE_TAG to a specific sha at deploy time).

Examples:
  scripts/deploy.sh dev
  scripts/deploy.sh dev IMAGE_TAG=dev-d40e85d
  aws-vault exec personal -- scripts/deploy.sh dev
EOF
}

is_valid_env() {
  local candidate="$1" name
  for name in "${VALID_ENVS[@]}"; do
    [[ "$name" == "$candidate" ]] && return 0
  done
  return 1
}

main() {
  if [[ $# -lt 1 || "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
    usage
    [[ $# -lt 1 ]] && exit 1 || exit 0
  fi

  local env_name="$1"
  shift
  if ! is_valid_env "$env_name"; then
    err "unknown env '$env_name'"
    usage >&2
    exit 1
  fi

  local env_file="${REPO_ROOT}/deploy/${env_name}.env"
  local compose_file="${REPO_ROOT}/deploy/docker-compose.swarm.yml"
  if [[ ! -f "$env_file" ]]; then
    err "env file not found: $env_file"
    exit 1
  fi
  if [[ ! -f "$compose_file" ]]; then
    err "compose file not found: $compose_file"
    exit 1
  fi

  # Load the deploy contract, then apply any CLI overrides.
  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  for kv in "$@"; do
    [[ "$kv" != *=* ]] && { err "bad override '$kv' (want KEY=value)"; exit 1; }
    eval "${kv%%=*}=$(printf '%q' "${kv#*=}")"
  done
  set +a

  : "${STACK_ENV:?missing STACK_ENV in $env_file}"
  : "${STACK_HOSTNAME:?missing STACK_HOSTNAME in $env_file}"
  : "${IMAGE_TAG:?missing IMAGE_TAG in $env_file}"
  : "${DATO_SECRET_NAME:?missing DATO_SECRET_NAME in $env_file}"

  local stack_name="circusliving-${STACK_ENV}"
  log "env=${env_name} stack=${stack_name} host=${STACK_HOSTNAME} tag=${IMAGE_TAG}"

  command -v aws >/dev/null 2>&1 || { err "aws CLI required"; exit 1; }

  if ! aws sts get-caller-identity >/dev/null 2>&1; then
    err "no AWS credentials reachable — run with the project's vault profile, e.g.:"
    err "  aws-vault exec personal -- scripts/deploy.sh ${env_name}"
    exit 1
  fi

  log "locating manager (Project=personal-infra Role=swarm-manager)"
  local instance_id
  instance_id=$(aws ec2 describe-instances \
    --filters \
      "Name=tag:Project,Values=personal-infra" \
      "Name=tag:Role,Values=swarm-manager" \
      "Name=instance-state-name,Values=running" \
    --query 'Reservations[].Instances[].InstanceId' \
    --output text)

  if [[ -z "$instance_id" || "$instance_id" == "None" ]]; then
    err "no manager instance found"
    exit 1
  fi
  instance_id=$(printf '%s\n' "$instance_id" | awk '{print $1}')
  log "manager: $instance_id"

  local compose_b64
  compose_b64=$(base64 < "$compose_file" | tr -d '\n')

  local tmp_params
  tmp_params=$(mktemp -t deploy-amp.XXXXXX.json)
  trap 'rm -f "$tmp_params"' EXIT

  # Build the remote script. ECR login is refreshed every deploy so the
  # manager can pull private images without a long-lived docker config.
  python3 - "$stack_name" "$compose_b64" \
    "$STACK_ENV" "$STACK_HOSTNAME" "$IMAGE_TAG" \
    "$DATO_SECRET_NAME" \
    "${NUXT_PUBLIC_CANONICAL_BASE_URL:-}" \
    "${NUXT_PUBLIC_GA_TAG_ID:-}" \
    "${REPLICAS:-1}" \
    "${IMAGE:-231549978717.dkr.ecr.us-east-1.amazonaws.com/circusliving/amp}" \
    "${AWS_REGION}" \
    >"$tmp_params" <<'PY'
import json, shlex, sys
(stack, b64,
 stack_env, hostname, tag,
 dato_secret,
 canonical, ga,
 replicas, image, region) = sys.argv[1:]
exports = "; ".join([
  f"export STACK_ENV={shlex.quote(stack_env)}",
  f"export STACK_HOSTNAME={shlex.quote(hostname)}",
  f"export IMAGE_TAG={shlex.quote(tag)}",
  f"export DATO_SECRET_NAME={shlex.quote(dato_secret)}",
  f"export NUXT_PUBLIC_CANONICAL_BASE_URL={shlex.quote(canonical)}",
  f"export NUXT_PUBLIC_GA_TAG_ID={shlex.quote(ga)}",
  f"export REPLICAS={shlex.quote(replicas)}",
  f"export IMAGE={shlex.quote(image)}",
])
registry = image.split('/', 1)[0]
script = (
  "set -euo pipefail; "
  f"mkdir -p /tmp/circusliving/{stack}; "
  f"echo '{b64}' | base64 -d > /tmp/circusliving/{stack}/docker-compose.swarm.yml; "
  f"aws ecr get-login-password --region {shlex.quote(region)} "
  f"  | docker login --username AWS --password-stdin {shlex.quote(registry)}; "
  f"{exports}; "
  f"docker stack deploy --with-registry-auth "
  f"  -c /tmp/circusliving/{stack}/docker-compose.swarm.yml {stack}"
)
json.dump({"commands": [f"bash -c {shlex.quote(script)}"]}, sys.stdout)
PY

  log "dispatching SSM Run Command"
  local command_id
  command_id=$(aws ssm send-command \
    --instance-ids "$instance_id" \
    --document-name "AWS-RunShellScript" \
    --comment "deploy circusliving-${STACK_ENV}@${IMAGE_TAG}" \
    --parameters "file://${tmp_params}" \
    --query 'Command.CommandId' \
    --output text)

  if [[ -z "$command_id" || "$command_id" == "None" ]]; then
    err "failed to dispatch SSM command"
    exit 1
  fi
  log "CommandId=$command_id"

  local status
  local attempt=0
  while (( attempt < 60 )); do
    attempt=$(( attempt + 1 ))
    status=$(aws ssm get-command-invocation \
      --command-id "$command_id" \
      --instance-id "$instance_id" \
      --query 'Status' \
      --output text 2>/dev/null || echo "Pending")
    case "$status" in
      Success)
        log "deploy ok (${stack_name})"
        exit 0
        ;;
      Failed|TimedOut|Cancelled)
        local stderr_out stdout_out
        stderr_out=$(aws ssm get-command-invocation \
          --command-id "$command_id" \
          --instance-id "$instance_id" \
          --query 'StandardErrorContent' \
          --output text 2>/dev/null || echo "")
        stdout_out=$(aws ssm get-command-invocation \
          --command-id "$command_id" \
          --instance-id "$instance_id" \
          --query 'StandardOutputContent' \
          --output text 2>/dev/null || echo "")
        err "deploy ${status}"
        [[ -n "$stdout_out" ]] && printf '%s\n' "$stdout_out" >&2
        [[ -n "$stderr_out" ]] && printf '%s\n' "$stderr_out" >&2
        exit 1
        ;;
    esac
    sleep 3
  done

  err "timeout polling CommandId=${command_id}"
  exit 2
}

main "$@"
