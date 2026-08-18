import { RawSourcePost } from '../../shared/patterns/structural/post.adapter';

/**
 * Contenido local de la práctica, con la misma forma que devolvería una API
 * real (id, userId, title, body), para poder seguir demostrando el Adapter
 * sin depender de un servicio externo con texto de relleno.
 */
export const POSTS_SOURCE: RawSourcePost[] = [
  {
    id: 1,
    userId: 1,
    title: 'Los 6 pilares de AWS Well-Architected',
    body: 'Excelencia operacional, seguridad, confiabilidad, rendimiento, costos y sostenibilidad. Cada decisión de arquitectura debería poder justificarse con al menos uno de estos seis.',
  },
  {
    id: 2,
    userId: 2,
    title: 'Por qué el dominio no debería conocer la infraestructura',
    body: 'Si tu lógica de negocio importa un cliente de S3 o un ORM, no puedes probarla sin levantar esa infraestructura. Las interfaces invierten esa dependencia.',
  },
  {
    id: 3,
    userId: 1,
    title: 'Builder: construir objetos complejos paso a paso',
    body: 'Cuando un objeto necesita muchos parámetros opcionales, un builder fluido deja claro qué combinaciones son válidas, en vez de un objeto de opciones sin tipar.',
  },
  {
    id: 4,
    userId: 3,
    title: 'Factory Method: delegar la decisión de qué crear',
    body: 'En vez de esparcir un if/else por todo el código para elegir una implementación, una fábrica centraliza esa decisión en un solo lugar.',
  },
  {
    id: 5,
    userId: 2,
    title: 'Adapter: traducir formatos externos sin contaminar el dominio',
    body: 'Ninguna API externa debería dictar la forma de tus modelos internos. Un adapter es el único punto que conoce ambos lados.',
  },
  {
    id: 6,
    userId: 1,
    title: 'Decorator: añadir comportamiento sin tocar el original',
    body: 'Logging, reintentos o caché se pueden envolver alrededor de una función existente, y quitarse después, sin modificar una sola línea de la lógica que envuelven.',
  },
  {
    id: 7,
    userId: 3,
    title: 'Strategy: intercambiar algoritmos en tiempo de ejecución',
    body: 'Ordenar por nombre o por fecha no debería requerir un if dentro del componente. Cada estrategia implementa la misma interfaz y el componente solo elige cuál usar.',
  },
  {
    id: 8,
    userId: 2,
    title: 'Observer: desacoplar a quien publica de quien escucha',
    body: 'Un servicio que falla no necesita saber qué componente muestra el error. Solo publica el evento; quien esté escuchando decide qué hacer con él.',
  },
  {
    id: 9,
    userId: 1,
    title: 'Currying: funciones que recuerdan sus argumentos',
    body: 'truncar(120) devuelve una función lista para usarse en cualquier texto, sin repetir ese número cada vez que se necesita.',
  },
  {
    id: 10,
    userId: 3,
    title: 'Aplicación parcial: fijar una parte, dejar el resto pendiente',
    body: 'Se puede fijar el campo por el que se filtra desde ya, y dejar el término de búsqueda pendiente hasta que el usuario escriba.',
  },
  {
    id: 11,
    userId: 2,
    title: 'Transducers: transformar datos en una sola pasada',
    body: 'Encadenar filter().map() crea un array intermedio por cada paso. Un transductor combina ambos pasos en una sola vuelta sobre los datos.',
  },
  {
    id: 12,
    userId: 1,
    title: 'CloudFront y S3: servir una SPA sin exponer el origen',
    body: 'El bucket queda privado; solo CloudFront puede leerlo mediante un Origin Access Control. Nadie puede acceder al bucket directamente, ni por accidente.',
  },
];
