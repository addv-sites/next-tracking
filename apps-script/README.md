# Captura de leads: Google Sheets + correo (Google Apps Script)

GitHub Pages es 100% estático, no corre backend. Este Apps Script actúa como backend
gratuito: recibe el formulario del sitio, lo guarda en una hoja de Google Sheets y
envía un correo de aviso.

## Pasos de despliegue (los haces tú, una sola vez, en tu cuenta de Google)

1. Crea (o abre) una Google Sheet nueva, por ejemplo **"Nextracking — Leads"**.
2. En la hoja: menú **Extensiones → Apps Script**.
3. Borra el contenido de `Code.gs` y pega el contenido completo de
   `apps-script/leads-webapp.gs` de este repo.
4. Revisa la constante `NOTIFY_EMAIL` en el script:
   - Ya está en modo prueba: `antonio.prado@addv.mx`.
   - Cuando quieras producción, cámbiala a `nextrackingmexico@gmail.com` (o la que decidan) y vuelve a desplegar (paso 6, "Nueva implementación").
5. Guarda el proyecto (ícono de disco / Ctrl+S). Nómbralo "Nextracking Leads Backend".
6. **Implementar → Nueva implementación**:
   - Tipo: **Aplicación web**.
   - Ejecutar como: **Yo (tu cuenta)**.
   - Quién tiene acceso: **Cualquier usuario**.
   - Clic en **Implementar**.
7. Google pedirá autorizar permisos (acceso a la Sheet y a enviar correo con
   `MailApp`, usando tu cuenta de Gmail/Workspace) — acepta.
8. Copia la **URL de la aplicación web** que termina en `/exec`.

## Conectar la URL al sitio

En la raíz del proyecto, crea un archivo `.env` (ya está en `.gitignore`, no se sube a git) con:

```
VITE_LEADS_WEBAPP_URL=https://script.google.com/macros/s/XXXXXXXXXXXXXXXX/exec
```

Para que GitHub Actions también la use al compilar el sitio, agrégala como **Secret** del
repositorio: **Settings → Secrets and variables → Actions → New repository secret**,
nombre `VITE_LEADS_WEBAPP_URL`, valor la misma URL `/exec`. El workflow
(`.github/workflows/deploy.yml`) ya la inyecta al build.

## Notas

- Cada vez que edites el código del Apps Script, debes crear una **Nueva implementación**
  (no basta con guardar) para que los cambios tomen efecto en la URL `/exec`.
- Los datos quedan en la pestaña **Leads** de tu Sheet, con encabezados automáticos.
- `MailApp.sendEmail` usa tu cuota diaria de Gmail (100 correos/día en cuentas
  personales, más en Workspace) — más que suficiente para leads de un formulario.
- Si más adelante quieres leer/exportar los leads desde otro sistema, la misma Sheet
  se puede conectar vía Google Sheets API o Zapier/Make.
