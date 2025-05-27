# PWAOFFLINE

Este proyecto tiene el propósito de servir una Aplicación Web Progresiva que permita el registro de datos en modo offline y al restablecer la conexión a Internet, sincronizar automáticamente los datos con un sistema backend.

## Elección de tecnologías

### Angular

Se optó por utilizar Angular debido a su capacidad para trabajar con services workers de una forma intuitiva y eficiente.
Por medio de su archivo de configuración `ngsw-config.json` se aplican las condiciones necesarias para administrar el uso de caché.

Además, la biblioteca por exelencia para utilizar reactividad en angular es RxJs. La cual fue de muchísima ayuda ya que utiliza observables, los cuales a diferencia de las promesas, pueden devolver más de un valor y así es como se logra escuchar los cambios que ocurren en un estado. En este caso se utiliza para estar atento a la conección del usuario y manejar las solicitudes http.

Mencionar también el incentivo que tiene Angular para realizar las pruebas unitarias, haciendo que sea un framework confiable y escalable.

### ExpressJS

Dentro de las opciones a elegir estaba ExpressJS, NestJs o Python y aunque NestJs era la opción más completa con mucha escalabilidad y funcionalidades, no se iba a aprovechar de la mejor manera en una app de desmostración. Lo que hubiera significado un mayor peso del proyecto y muchas funcionalidades sin utilizarse.

Así que entre las dos opciones restantes se eligió ExpressJS por su configuración y modularidad, pues NestJS de hecho es una capa más amplia del mismo ExpressJS. Así que se aprovechó la separación de rutas, controladores y servicios. Además de una conexión intuitiva de la base de datos postgresql

### Postgresql

Una de las base de datos SQL más populares. Aunque la aplicación podría trabajarse sin base de datos por medio de estructuras como Arrays almacenadas en memoria, se optó por incluir la persistencia de datos por medio de una base de datos relacional como postgresql y así permitir el uso de consultas rápidas y asegurar la integridad de los datos.

## Manejo de estados (Errores, carga, éxitos)

Se hizo uso de la biblioteca toast, este enfoque evita ensuciar el html con lógica de verificaciones. En su lugar, crea alertas flotantes customizables e intuitivas para el usuario

## Descripción de la implementación Offline/Online

Como se mencionó anteriormente se hizo uso de la biblioteca RxJs para manejar la escucha a los cambios de red.
Así que por medio de un servicio se comparte una Signal de Angular a través de la aplicación y se sabe en todo momento el estado de la red.

Las configuraciones en el `ngsw-config.json` se ajustaron para lograr el siguiente flujo:

### Online

Si hay conexión a internet, se prioriza los datos frescos, de este modo en el inicio siempre se verán los productos actualizados.

Así mismo, cuando se crea un producto, se pasa directamente al backend para insertar el objeto en la base de datos por medio del servicio de productos, el cual redirige a indexedDB si está offline, pero si está online realiza la solicitud post al backend.

### Offline con IndexedDB

Cuando no hay conexión a internet, se acude al caché para traer los archivos estáticos html, css, js y assets como fuentes o recursos multimedia. De esta forma es posible simular peticiones get de archivos

Adicionalmente, para las peticiones gets por medio de REST API se utilizó un interceptor en Angular, así es posible llamar a `get(/products)` o `post(/products)` y concatenar con el interceptor la url base de la API. Así se logró tener caché de las peticiones del backend sin exponer la api en el `ngsw-config.json`

Sin embargo, para los datos dinámicos hace falta ayuda de las API del navegador como localstorage o IndexedDB. En este caso se utilizó indexedDB por ser más flexible que localstorage y guardar la información en local como si se estuviera trabajando con una base de datos dedicada.

Se creó el servicio dedicado a la consulta, creación, modificación y eliminación de filas en la base de datos IndexedDB interna.

De esta forma la web es totalmente navegable sin conexión, ya que en el inicio (/) trae del caché si no detecta conexión después de 5s y la creación de productos permanece en la base de datos de indexedDB hasta recuperar la conexión

### Politicas de reintento

La configuración establecida en `ngsw-config.json` indica que:

- Los archivos estáticos como html css js siempre serán cacheados para su posterior uso sin conexión

- Los assets como imágenes o fuentes del frontend se cachearán sólo si son utilizados

- Los recursos traidos por REST API son guardados con una vigencia de `1d` y una capacidad de `100` respuestas. Se utilizarán como segunda opción si se supera el timeout de red de `5s`.

- La gestión de red se realiza por medio del código utilizando la reactividad de RxJs, por lo que si no hay conexión, no hay por qué enviar la solicitud HTTP. En su lugar, se guardan en el IndexedDB hasta que haya una conexión de red dispuesta a enviar la solicitud. Una vez se establece la conexión se envían los productos en un lote para ser procesados en el backend.

### Posibles Mejoras

- Limite del lote. Actualmente se envían instantaneamente todos los productos que fueron creados offline al servidor. Esto podría causar perdida de información si una unidad del lote falla. Además, con esta implementación se podría trabajar con grandes volúmenes de datos y gestionar barras de cargas como Google Fotos y su sincronización.

- Background Sync. Es una API del navegador para lograr la sincronización de datos y trabajar de una forma más profesional ahorrando recursos. Sin embargo, podría complicar el debugging.

- Paginación de productos. Pensando en la aplicación a la escalabilidad, se puede optimizar el tiempo de cómputo del servidor y el tiempo de renderizado del frontend añadiendo paginaciones.

- Creación de tests. Los test son muy importantes para continuar con la creación de aplicaciones a gran escala y sobre todo cuando se trabaja en un equipo de desarrollo. Ayuda a realizar modificaciones confiables y mejora la confiabilidad del código.

- Implementación de CI/CD. Ahora que el proyecto se encuentra compatible con tecnologías de contenedores, se puede agilizar el CI/CD por medio de github actions y así tener versiones recientes desplegadas y mitigar fallos a la hora de juntar cambios.
