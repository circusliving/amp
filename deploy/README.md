# Circus Living — Swarm deployment

The container image (`circusliving/amp`) is built and pushed by
`.github/workflows/build-and-push.yml` to AWS ECR
(`231549978717.dkr.ecr.us-east-1.amazonaws.com/circusliving/amp`). This
folder holds the Docker Swarm stack definition that runs that image on the
personal-infra swarm manager.

For now `dev`, `stg`, and `prod` all run on the **same** swarm manager
under three different stack names — one swarm, three Traefik routers, three
hostnames, three TLS certs. CloudFront (managed in the CDK app under
`personal-infra/cdk`) sits in front of `prod` when wired up.

## Prerequisites on the manager

1. Overlay network `traefik-public` exists (created by the personal-infra
   `swarm/traefik` stack).
2. External docker secret(s) for the DatoCMS API token:

   ```sh
   # one shared token across envs (simplest)
   docker secret create dato_api_token - <<< "$NUXT_DATO_API_TOKEN"

   # OR per-env tokens
   docker secret create dato_api_token_dev  - <<< "$NUXT_DATO_API_TOKEN_DEV"
   docker secret create dato_api_token_stg  - <<< "$NUXT_DATO_API_TOKEN_STG"
   docker secret create dato_api_token_prod - <<< "$NUXT_DATO_API_TOKEN_PROD"
   ```

   When using per-env secrets, set `DATO_SECRET_NAME=dato_api_token_<env>`
   in the deploy env.
3. The manager has logged in to ECR:

   ```sh
   aws ecr get-login-password --region us-east-1 \
     | docker login --username AWS --password-stdin \
       231549978717.dkr.ecr.us-east-1.amazonaws.com
   ```

## Deploy

```sh
# dev
STACK_ENV=dev \
STACK_HOSTNAME=dev.circusliving.com \
IMAGE_TAG=dev-$(git rev-parse --short HEAD) \
docker stack deploy -c deploy/docker-compose.swarm.yml circusliving-dev

# stg
STACK_ENV=stg \
STACK_HOSTNAME=stg.circusliving.com \
IMAGE_TAG=stg-$(git rev-parse --short HEAD) \
docker stack deploy -c deploy/docker-compose.swarm.yml circusliving-stg

# prod
STACK_ENV=prod \
STACK_HOSTNAME=www.circusliving.com \
IMAGE_TAG=v1.2.3 \
docker stack deploy -c deploy/docker-compose.swarm.yml circusliving-prod
```

`STACK_ENV` is interpolated into the Traefik router/service names
(`circusliving-dev`, `circusliving-stg`, `circusliving-prod`) so all three
stacks coexist on the same Traefik instance without collision.

## DNS

- `dev.circusliving.com` — managed by `personal-infra/cdk/lib/reverse-proxy-stack.ts`
  (A record → swarm manager EIP).
- `stg.circusliving.com`, `www.circusliving.com` — apex `circusliving.com`
  is owned outside this account. Either:
  - delegate `stg.` (and `www.` if needed) as new hosted zones in the CDK
    app and have the apex owner add NS records, **or**
  - point the records directly at the swarm manager EIP (or CloudFront)
    from the apex registrar.

## Health

```sh
curl -fsSL https://dev.circusliving.com/
docker service ps circusliving-dev_web --no-trunc
```

Container-level: `wget http://localhost:8000/` every 30s.

## Local dev

The `docker-compose.yml` at the repo root is for **local** development
(`docker compose up --build`). It builds from source and binds port 8000;
it does not use Traefik or Swarm. Use the file in this folder for any
remote/manager deployment.
