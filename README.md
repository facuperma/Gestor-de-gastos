# Gestor de gastos

Aplicación web para registrar ingresos y gastos personales, ver el balance y analizar en qué se va la plata. Hecha con **TypeScript, HTML y CSS**, sin frameworks.

> 🔗 Demo: _próximamente_

<!-- TODO: agregar captura o GIF -->

## Funcionalidades

- Registrar ingresos y gastos con categoría, monto y fecha
- Balance de ingresos, gastos y saldo
- Desglose de gastos por categoría
- Filtros por tipo y por mes
- Persistencia en el navegador (`localStorage`)
- Modo oscuro automático y diseño responsive

## Stack

- **TypeScript** en modo `strict`
- **Vite** para el desarrollo y el build
- **Vitest** para los tests unitarios
- CSS puro con custom properties

## Decisiones técnicas

- **Montos en centavos (enteros)** para evitar errores de punto flotante (`0.1 + 0.2 !== 0.3`).
- **Unión discriminada** (`Income | Expense`): el compilador impide asignar a un ingreso una categoría de gasto.
- **Validación sin excepciones** con un tipo `Result<T, E>`; el formulario muestra todos los errores juntos.
- **Repositorio genérico** (`Repository<T>`) desacoplado de `localStorage`; se inyecta el almacenamiento, así es testeable y fácil de cambiar por una API o IndexedDB.
- **Datos persistidos validados al leer** con un *type guard*, para que datos corruptos no rompan la app.
- **Sin `innerHTML` con datos del usuario**: el DOM se construye con nodos de texto, lo que previene XSS.
- **Lógica de negocio en funciones puras** (`services/`), separada de la UI y cubierta por tests.

## Estructura

```
src/
├── models/      Tipos de dominio y type guards
├── services/    Lógica de negocio pura (cálculos, filtros, validación)
├── storage/     Persistencia (repositorio genérico)
├── ui/          Renderizado y eventos del DOM
├── utils/       Formato de moneda y fechas
└── main.ts      Punto de entrada: conecta todas las capas
```

## Cómo ejecutarlo

```bash
npm install
npm run dev        # servidor de desarrollo
npm test           # tests en modo watch
npm run build      # build de producción en dist/
```

## Próximos pasos

- [ ] Editar transacciones
- [ ] Gráficos (gasto mensual y por categoría)
- [ ] Conversión de divisas con una API pública
- [ ] Exportar e importar CSV
- [ ] Presupuestos por categoría con alertas
- [ ] Deploy en Vercel o Netlify
