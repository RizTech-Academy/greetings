# greetings

**The reference project for the [RizTech Academy](https://www.riztechacademy.com/learn) DevOps Complete
Foundation course.**

`greetings` is a tiny web service, kept deliberately small, that threads through the hands-on modules of the
course. You containerise it, orchestrate it on Kubernetes, ship it with a CI/CD pipeline, and describe
infrastructure for it with Terraform — each module adds one layer, all against the same simple app.

The app itself is trivial on purpose: an Express server with two endpoints — `/health` (for probes) and `/`
(a greeting, plus a visit counter backed by Redis when one is available). The point is not the app; it is
everything *around* it.

## What's here, and which module it belongs to

| Path | Module | What it shows |
|------|--------|---------------|
| `src/`, `package.json` | — | The tiny app: config from the environment, a `/health` endpoint, tests. |
| `Dockerfile`, `.dockerignore` | Containers | A multi-stage, non-root, small production image. |
| `compose.yaml` | Containers | The app + Redis as a local stack, with a persistent volume. |
| `k8s/` | Kubernetes | Deployment, Service, ConfigMap, Secret — with probes, resources and self-healing. |
| `.github/workflows/ci.yml` | CI/CD | Build → test → image build on every push and PR. |
| `terraform/` | Infrastructure as Code | A runnable Terraform config (local/random providers — no cloud needed). |

## Run it

```bash
npm install
npm test              # the test suite (2 tests)
npm start             # the app on http://localhost:3000  (GREETING and PORT from the environment)
```

### With Docker

```bash
docker build -t greetings:1.0 .
docker run -p 3000:3000 -e GREETING="Namaste" greetings:1.0
```

### The full local stack (app + Redis)

```bash
docker compose up -d
curl localhost:3000/          # the visit counter increments and persists across restarts
docker compose down
```

### On Kubernetes (a local cluster, e.g. kind)

```bash
kind create cluster
kind load docker-image greetings:1.0
kubectl apply -f k8s/
kubectl get pods
kubectl port-forward service/greetings 8080:80
curl localhost:8080/
```

### Terraform (no cloud account needed)

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## A note for learners

This is a teaching codebase. It is intentionally minimal so the *infrastructure* around it — the Dockerfile,
the manifests, the pipeline, the Terraform — is the thing you study. Every file has comments explaining the
choices. Work through the course, and build each layer yourself; compare with this repo when you get stuck.
