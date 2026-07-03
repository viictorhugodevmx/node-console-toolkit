# Node Console Toolkit

CLI interna creada con Node.js y TypeScript para practicar fundamentos backend sin framework.

Esta app trabaja con un archivo local `data/users.json` y permite crear, buscar, actualizar, eliminar, validar, reparar, importar, exportar y respaldar usuarios desde terminal.

## Stack

- Node.js 20.19.4
- TypeScript 5.9.3
- fs
- path
- crypto
- console.table
- Bash scripts

## Instalación

```bash
npm install
Scripts
npm run dev
npm run build
npm run start
Ejecutar en desarrollo
npm run dev -- help
Ejecutar compilado
npm run build
npm run start -- help
Estructura principal
src/
  cli/
    command-router.ts
    commands.ts
  modules/
    backup/
    crypto-tools/
    export/
    health/
    import/
    json-files/
    repair/
    stats/
    users/
    validation/
data/
  users.json
backups/
scripts/
  smoke-test.sh
Comandos disponibles
Ayuda y diagnóstico
npm run dev -- help
npm run dev -- version
npm run dev -- health-check
Usuarios
npm run dev -- create-user Victor victor@app1.com
npm run dev -- list-users
npm run dev -- count-users
npm run dev -- find-user victor@app1.com
npm run dev -- search-users victor
npm run dev -- filter-users app1.com
npm run dev -- sort-users name asc
npm run dev -- update-user victor@app1.com VictorPro victor.pro@app1.com
npm run dev -- delete-user victor.pro@app1.com
npm run dev -- reset-users
Validación y reparación
npm run dev -- validate-users
npm run dev -- repair-users
Backups, import y export
npm run dev -- export-users backups/users-backup.json
npm run dev -- import-users backups/users-backup.json
npm run dev -- backup-users
JSON tools
npm run dev -- read-json data/users.json
npm run dev -- read-json package.json
Crypto tools
npm run dev -- hash-password 123456
npm run dev -- generate-token
npm run dev -- generate-token 32
Echo
npm run dev -- echo Backend Node con Tokio
Smoke test

Ejecuta:

./scripts/smoke-test.sh

El smoke test valida:

build
health-check
create-user
count-users
find-user
search-users
filter-users
sort-users
validate-users
backup-users
delete-user

Resultado esperado:

Smoke test completed successfully
Flujo recomendado antes de operaciones delicadas

Antes de resetear, reparar o modificar data manualmente:

npm run dev -- backup-users
npm run dev -- validate-users

Después de la operación:

npm run dev -- validate-users
npm run dev -- count-users
Archivo de datos

La CLI usa:

data/users.json

Formato de usuario:

{
  "id": "uuid",
  "name": "Victor",
  "email": "victor@app1.com",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-02T00:00:00.000Z"
}

updatedAt es opcional.

Conceptos practicados
process.argv
router de comandos
validación de argumentos
módulos nativos de Node
fs
path
crypto
lectura y escritura de JSON
type guards
normalización de datos
búsqueda
filtros
ordenamiento
estadísticas
backups
import/export
validación de integridad
reparación de data corrupta
health check
smoke test
process.exitCode
Equivalencias backend

Esta CLI practica ideas que aparecen también en APIs:

CLI command       API equivalente
----------------------------------------
list-users        GET /users
find-user         GET /users/:email
search-users      GET /users?search=victor
filter-users      GET /users?domain=app1.com
sort-users        GET /users?sortBy=name&direction=asc
create-user       POST /users
update-user       PATCH /users/:email
delete-user       DELETE /users/:email
count-users       GET /users/count
health-check      GET /health
validate-users    job interno de auditoría
repair-users      job interno de mantenimiento
backup-users      tarea interna de respaldo
Estado

App 1 terminada como CLI toolkit base para fundamentos de Node.js.
