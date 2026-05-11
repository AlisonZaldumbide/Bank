# BankPro

Banco Pro es una aplicación web desarrollada con Angular 19 que permite administrar productos vía un CRUD con consumo de API REST.

## Requisitos

- Node.js 18+ / npm 10+
- Angular 19.2.10
- Backend disponible en `http://localhost:3002`

## Instalación

1. Clona el repositorio.
2. Instala dependencias:

```bash
npm install
```

## Levantar backend local (requerido)

Esta prueba consume servicios locales de Node.js.

1. Descomprime `repo-interview-main.zip`.
2. Abre una terminal en ese proyecto.
3. Ejecuta:

```bash
npm install
npm run start:dev
```

4. Verifica que el backend quede disponible en `http://localhost:3002`.

## Ejecutar la aplicación

```bash
npm start
```

Luego abre el navegador en `http://localhost:4200/`.

## Construir para producción

```bash
npm run build
```

## Pruebas

```bash
npm test
```

Cobertura:

```bash
npm run test:coverage
```

## Características implementadas

- Angular 19 con módulos feature (`MainModule`, `ProductModule`).
- Lazy loading de `ProductModule`.
- Guardas de ruta con `AuthGuard`.
- Interceptor HTTP global para cabeceras y manejo de errores.
- Consumo de API REST con `HttpClient`.
- Formularios reactivos y validaciones personalizadas.
- Uso de observables y operadores RxJS.
- Validación cruzada de fechas (`date_revision` exactamente un año después de `date_release`).
- Arquitectura modular y separación de responsabilidades.
- Estilos responsive para formularios y listado de productos.
- Estado del listado con fachada (`ProductFacadeService`) para desacoplar UI y capa de datos.

## Estructura del proyecto

- `src/app/core`: servicios y lógica compartida de infraestructura.
- `src/app/modules/main`: componentes de UI global como `header` y `modal`.
- `src/app/modules/product`: CRUD de productos, formularios y validadores.

## Arquitectura y criterio técnico

- `ProductService` contiene solamente lógica de consumo HTTP y mapeo de errores.
- `ProductFacadeService` centraliza estado de listado (`products`, `loading`, `error`) y coordinación de flujos.
- Los componentes se enfocan en interacción y representación.
- Validaciones de negocio encapsuladas en validators reutilizables.

## Principios SOLID aplicados

- **S**: separación entre infraestructura (`core`), negocio/datos (`services`) y presentación (`components`).
- **O**: nuevas reglas de validación se agregan mediante validators sin alterar componentes existentes.
- **L**: contratos tipados (`Product`, `ApiResponse`, `ApiError`) usados de forma consistente.
- **I**: separación de responsabilidades por módulo y por servicio.
- **D**: dependencias inyectadas por Angular DI, evitando acoplamientos directos.

## Cobertura y evidencia

Se incluyen pruebas unitarias con Jest para:

- componentes de listado y formulario,
- validadores síncronos y asíncronos,
- servicios HTTP y fachada de estado.

Ejecuta cobertura con:

```bash
npm run test:coverage
```

El objetivo de la prueba es mantener un mínimo de 70%.

## Notas importantes

- El servicio de productos usa la URL base `http://localhost:3002/bp/products`.
- Si el backend está en otra URL, actualiza `ProductService`.
- Se implementa manejo visual de errores por campo y errores de API mediante modal.

---

Si necesitas ajustar la URL de la API o agregar autenticación real, los componentes `AuthGuard` y `ApiInterceptor` ya están preparados para extenderse.
