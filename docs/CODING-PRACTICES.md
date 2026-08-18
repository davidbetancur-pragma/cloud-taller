# Patrones de diseño GoF + Programación funcional — cloud-taller

Registro de dónde vive cada patrón/concepto y por qué se eligió ese punto del código, no solo que "toca aplicarlo".

## Patrones GoF

| Categoría | Patrón | Archivo | Por qué encaja ahí |
|---|---|---|---|
| Creacional | **Builder** | `app/src/app/shared/patterns/creational/http-query-builder.ts` | La petición a `/posts` necesita combinar `_limit`, `_sort`, `_order` y opcionalmente `userId`. Un builder fluido evita pasar un objeto de opciones sin tipar y deja explícito qué combinaciones son válidas. |
| Creacional | **Factory Method** | `app/src/app/shared/patterns/creational/logger-factory.ts` | `PostsApiService` no debe decidir con un `if` disperso si loguea o no; `LoggerFactory.create(enableRequestLogging)` centraliza esa decisión y devuelve la implementación (`ConsoleLogger`/`NoopLogger`) correcta según el ambiente. |
| Estructural | **Adapter** | `app/src/app/shared/patterns/structural/post.adapter.ts` | La API pública (JSONPlaceholder) devuelve `{ userId, id, title, body }`. El resto de la app trabaja con el modelo `Post` (`authorId`, `summary`). El adapter es el único lugar que conoce la forma externa. |
| Estructural | **Decorator** | `app/src/app/shared/patterns/structural/with-logging.decorator.ts` | `withLogging(fn, logger, label)` añade logging alrededor de la llamada HTTP sin tocar `PostsApiService.requestPosts`; se puede quitar o añadir sin modificar la lógica de negocio. |
| Comportamental | **Strategy** | `app/src/app/shared/patterns/behavioral/sort-strategy.ts` | El componente de lista necesita alternar entre ordenar por título o por fecha. Cada estrategia implementa `SortStrategy`; el componente solo pide "la estrategia activa" sin conocer el algoritmo. |
| Comportamental | **Observer** | `app/src/app/shared/patterns/behavioral/notification-bus.ts` | Cuando `PostsApiService` falla, necesita avisar a la UI sin conocerla. `NotificationBus.publish()` desacopla al publicador (el servicio) de los observadores (el componente que muestra el error). |

## Programación funcional

| Concepto | Archivo | Por qué encaja ahí |
|---|---|---|
| **Currying** | `app/src/app/shared/functional/curry.ts` (`truncate`, `formatCurrency`) | `truncate(120)` fija el largo máximo una sola vez y produce un truncador reutilizable (`truncateSummary`) que se aplica a cada resumen de post sin repetir el argumento. |
| **Partial Application** | `app/src/app/shared/functional/partial.ts` (`containsInTitle`) | `fieldContains(field, term, item)` es genérico para cualquier campo. `containsInTitle()` fija `field = 'title'` una vez; el término de búsqueda y el post quedan como argumentos pendientes que llegan después, mientras el usuario escribe. |
| **Transducers** | `app/src/app/shared/functional/transducers.ts` | `PostsListComponent.visiblePosts` combina un filtro por término de búsqueda y un truncado de resumen. Encadenar `.filter().map()` crearía un array intermedio; `composeTransducers(filtering(...), mapping(...))` aplica ambos pasos en una sola pasada sobre la lista ya ordenada. |

## Cómo verificar cada uno

Cada archivo de patrón/concepto tiene un `*.spec.ts` junto a él que demuestra el comportamiento (no solo que la clase/función existe). Ejecutar:

```bash
cd app
npm test -- --watch=false
```
