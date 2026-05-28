# Circus Living — Swarm deployment

The container image (`circusliving/amp`) is built and pushed by
`.github/workflows/build-and-push.yml` to AWS ECR
(`231549978717.dkr.ecr.us-east-1.amazonaws.com/circusliving/amp`). This
folder holds the Docker Swarm stack definition that runs that image on
the `personal-infra` swarm manager and the per-env deploy contracts.

For now `dev`, `stg`, and `prod` all run on the **same** swarm manager
under three different stack names — one swarm, three Traefik routers,
three hostnames, three TLS certs. CloudFront (managed in the CDK app
under `personal-infra/cdk`) sits in front of `prod` when wired up.

## Files in this folder

| File | Purpose |
|---|---|
| `docker-compose.swarm.yml` | The Swarm stack. Parameterised; reads the env vars listed in the per-env contract. |
| `dev.env` | Deploy contract for `circusliving-dev` (the **single source of truth** for what is shipped to dev). |
| `stg.env` *(create when promoting stg)* | Same shape for `circusliving-stg`. |
| `prod.env` *(create when promoting prod)* | Same shape for `circusliving-prod`. |

The matching deploy script is `scripts/deploy.sh` at the repo root. It
reads `deploy/<env>.env`, base64-encodes the compose file, and dispatches
`docker stack deploy` on the swarm manager via SSM Run Command — no SSH
key, no inbound port, audit-logged in CloudTrail.

## Prerequisites on the manager

1. Overlay network `traefik-public` exists (created by the
   `personal-infra` `swarm/traefik` stack).
2. External docker secret(s) for the DatoCMS API token. The Nuxt app
   reads the token from `NUXT_DATO_API_TOKEN_FILE` (see
   `nuxt.config.ts:resolveDatoToken`), so the secret name in the
   contract maps to a file mount inside the container.

   ```sh
   # one shared token across envs (simplest)
   docker secret create dato_api_token - <<< "$NUXT_DATO_API_TOKEN"

   # OR per-env tokens
   docker secret create dato_api_token_dev  - <<< "$NUXT_DATO_API_TOKEN_DEV"
   docker secret create dato_api_token_stg  - <<< "$NUXT_DATO_API_TOKEN_STG"
   docker secret create dato_api_token_prod - <<< "$NUXT_DATO_API_TOKEN_PROD"
   ```

   When using per-env secrets set `DATO_SECRET_NAME=dato_api_token_<env>`
   in the matching `deploy/<env>.env`.
3. The manager is logged in to ECR. `scripts/deploy.sh` re-runs the
   login on every deploy, but for one-off manual `docker stack deploy`
   you need to run it yourself:

   ```sh
   aws ecr get-login-password --region us-east-1 \
     | docker login --username AWS --password-stdin \
       231549978717.dkr.ecr.us-east-1.amazonaws.com
   ```

## Deploy

```sh
# Deploy dev as defined by deploy/dev.env
aws-vault exec personal -- scripts/deploy.sh dev

# Pin a specific image sha (the floating dev tag is fine for most
# deploys; pin when reproducing or rolling back).
aws-vault exec personal -- scripts/deploy.sh dev IMAGE_TAG=dev-d40e85d
```

The stack name is always `circusliving-${STACK_ENV}` — the env-file
controls everything else. **Do not** `docker stack deploy` with a
different stack name (e.g. via the Portainer UI) — Traefik labels in
the compose use `${STACK_ENV}` for router/service names and the two
must agree.

## What's in `dev.env`

Everything required to reproduce a deploy. Treat the file as code:

- `STACK_ENV` — interpolated into stack name + Traefik router name
- `STACK_HOSTNAME` — must already resolve to the swarm manager EIP
  (managed by `personal-infra/cdk/lib/reverse-proxy-stack.ts`)
- `IMAGE_TAG` — ECR tag to pull
- `DATO_SECRET_NAME` — docker secret to mount as
  `/run/secrets/dato_api_token` and expose to Nuxt via
  `NUXT_DATO_API_TOKEN_FILE`
- `NUXT_PUBLIC_CANONICAL_BASE_URL`, `NUXT_PUBLIC_GA_TAG_ID`, `REPLICAS`

## DNS

`dev.circusliving.com` resolves directly out of the `circusliving.com`
apex hosted zone (Route53, same AWS account as personal-infra) via an
`A` record managed by `personal-infra/cdk/lib/reverse-proxy-stack.ts`.

`stg.circusliving.com`, `www.circusliving.com` — same plan when those
envs come online; CDK will own the records.

## Health

```sh
curl -fsSL https://dev.circusliving.com/

# From the manager (via SSM):
aws-vault exec personal -- aws ssm send-command \
  --instance-ids $(aws ec2 describe-instances \
    --filters 'Name=tag:Project,Values=personal-infra' \
              'Name=tag:Role,Values=swarm-manager' \
              'Name=instance-state-name,Values=running' \
    --query 'Reservations[].Instances[].InstanceId' --output text) \
  --document-name AWS-RunShellScript \
  --parameters 'commands=["docker service ps circusliving-dev_web --no-trunc"]'
```

Container-level: `wget http://localhost:8000/` every 30s (the `wget`
binary is installed in the runner stage of `Dockerfile` specifically
for this healthcheck — don't remove it).

## Local dev

The `docker-compose.yml` at the repo root is for **local** development
(`docker compose up --build`). It builds from source and binds port
8000; it does not use Traefik or Swarm. Use the files in this folder
for any remote/manager deployment.
