# AWS Well-Architected Review — cloud-taller

Revisión explícita de cómo este proyecto implementa cada uno de los 6 pilares del [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/), desde la perspectiva de un frontend engineer desplegando una SPA estática.

| Pilar | Decisión concreta | Por qué |
|---|---|---|
| **Excelencia Operacional** | Pipeline en `.github/workflows/deploy.yml`: `npm ci` → tests → `ng build` → `s3 sync` → invalidación de CloudFront, disparado en cada push a `main`. | Despliegues reproducibles y sin pasos manuales; cualquier cambio pasa por el mismo camino, reduciendo errores humanos. |
| **Excelencia Operacional** | `environment.ts` / `environment.development.ts` separan configuración por ambiente (`enableRequestLogging`, `apiBaseUrl`). | Evita hardcodear valores de un ambiente en el build de otro; el comportamiento de logging cambia sin tocar código. |
| **Excelencia Operacional** | Logging de acceso de CloudFront a un bucket S3 dedicado (`aws_s3_bucket.logs` en `infra/main.tf`). | Da visibilidad de tráfico y errores en producción sin depender de herramientas externas. |
| **Seguridad** | Bucket S3 del sitio con `block_public_acls`/`restrict_public_buckets` en `true` y sin website-hosting habilitado; solo CloudFront puede leerlo vía Origin Access Control. | El origen nunca queda expuesto directamente a internet; un enlace directo al bucket no sirve contenido. |
| **Seguridad** | Certificado por defecto de CloudFront (`*.cloudfront.net`) + `viewer_protocol_policy = "redirect-to-https"`. | Todo el tráfico se sirve por HTTPS sin necesitar un dominio propio ni gestionar un certificado ACM; HTTP se redirige, nunca se sirve contenido sin cifrar. |
| **Seguridad** | Rol IAM para GitHub Actions vía OIDC (`aws_iam_role.deploy` + `data.aws_iam_openid_connect_provider.github`) en vez de access keys almacenadas como secretos estáticos. | Las credenciales son temporales y están acotadas al repo exacto (`sub` condition), reduciendo el impacto de una fuga. |
| **Confiabilidad** | `PostsApiService.list()` captura errores con `catchError`, publica el fallo en `NotificationBus` y el componente ofrece un botón "Reintentar". | La app no se queda en un estado roto ante un fallo de red; el usuario puede recuperarse sin recargar la página. |
| **Confiabilidad** | Se usa el dominio `*.cloudfront.net` que CloudFront gestiona internamente (sin Route53 propio, al no tener dominio registrado). | CloudFront resuelve y mantiene ese dominio sin intervención manual; si más adelante se agrega un dominio propio, basta con añadir ACM + Route53 sin tocar el resto de la infra. |
| **Eficiencia de Rendimiento** | Rutas cargadas de forma perezosa (`loadChildren`/`loadComponent` en `app.routes.ts` y `posts.routes.ts`). | El bundle inicial no incluye código de features que el usuario aún no visita. |
| **Eficiencia de Rendimiento** | Presupuestos de bundle reducidos en `angular.json` (300kB warning / 600kB error en el build inicial). | Fuerza a notar un crecimiento de bundle antes de que llegue a producción, en vez de descubrirlo por quejas de usuarios. |
| **Eficiencia de Rendimiento** | CloudFront como CDN delante de S3, con compresión (`compress = true`) habilitada. | El contenido se sirve desde el borde más cercano al usuario y comprimido, reduciendo latencia y peso de transferencia. |
| **Optimización de Costos** | `cloudfront_price_class = "PriceClass_100"` en vez de la clase por defecto (todas las regiones). | Limita las ubicaciones de borde a las de menor costo; razonable para una audiencia no verdaderamente global. |
| **Optimización de Costos** | Todos los recursos de `infra/` llevan el tag `Project = cloud-taller`. | Permite atribuir el costo de este ejercicio en el billing de la cuenta, en vez de mezclarse con otros recursos. |
| **Sostenibilidad** | Hosting 100% estático (sin servidores propios, sin cómputo idle) servido desde CDN. | El único cómputo que se ejecuta es el necesario para servir archivos ya construidos; no hay instancias corriendo sin uso. |

## Cómo desplegar

1. Definir `github_org` y `github_repo` en `infra/terraform.tfvars` (o pasarlos como `-var` al aplicar).
2. `terraform init && terraform plan` dentro de `infra/` con credenciales AWS propias.
3. `terraform apply` cuando el plan se vea correcto.
4. Configurar en el repo de GitHub los secrets `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID` con los outputs de Terraform.
5. Push a `main` dispara `deploy.yml`.

> Nota: esta configuración usa el dominio por defecto de CloudFront (`*.cloudfront.net`), sin dominio propio ni Route53. Si más adelante se registra un dominio, se puede añadir un recurso `aws_acm_certificate` + `aws_route53_record` y setear `aliases` en la distribución sin tocar el resto.
