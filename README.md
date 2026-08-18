# cloud-taller

Práctica integral de crecimiento como frontend: una app Angular desplegada en AWS siguiendo el **AWS Well-Architected Framework**, y codificada aplicando conscientemente **patrones de diseño GoF** y **conceptos de programación funcional**.

- [`docs/WELL-ARCHITECTED.md`](docs/WELL-ARCHITECTED.md) — cada pilar del framework, la decisión concreta que lo implementa y por qué.
- [`docs/CODING-PRACTICES.md`](docs/CODING-PRACTICES.md) — cada patrón GoF y concepto funcional, el archivo donde vive y por qué encaja ahí.

## Estructura

```
app/     Angular app (standalone components, Vitest)
infra/   Terraform: S3 + CloudFront + Route53 + ACM + rol OIDC para CI/CD
.github/ Workflow de despliegue (GitHub Actions)
docs/    Revisión de arquitectura y de prácticas de codificación
```

## Desarrollo local

```bash
cd app
npm install
npm start          # http://localhost:4200
npm test -- --watch=false
npm run build -- --configuration production
```

## Despliegue

Ver la sección "Cómo desplegar" en [`docs/WELL-ARCHITECTED.md`](docs/WELL-ARCHITECTED.md).
