# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

````js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # Mini Attendance Frontend

    This is a small React + Vite frontend for the Mini Attendance System technical test.

    Features implemented:
    - Login / Register (token stored in `localStorage`)
    - Check-in and Check-out buttons
    - Reports view with filter by status and CSV export

    Environment
    - Defaults to backend `http://localhost:4002` for attendance API. You can change `VITE_API_BASE` in `.env` at the project root.

    Run locally
    1. Install deps:
    ```powershell
    cd frontend
    npm install
    ```
    2. Run dev server:
    ```powershell
    npm run dev
    ```

    Notes
    - The frontend uses `axios` with an Authorization header populated from `localStorage`.
    - Auth endpoints are on `http://localhost:4001` (register/login) and attendance endpoints on `http://localhost:4002`.
    - Reports endpoint in the backend must exist to fetch reports; if not present, implement `/reports` in the backend to return `dailyReport` entries.

    Next steps I can help with:
    - Add a Dockerfile for the frontend and wire it into `docker-compose.yml`.
    - Expand UI with user-friendly components and times formatting.
    - Add unit tests for critical components.
````
