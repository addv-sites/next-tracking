/**
 * Nextracking — Lead capture Web App
 * -----------------------------------
 * Receives the quote-request form as JSON POST, appends a row to the
 * bound Google Sheet, and emails the sales inbox. Deploy as a Web App
 * (see apps-script/README.md). Paste this whole file into
 * script.google.com, bound to the target Spreadsheet.
 */

const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = 'antonio.prado@addv.mx'; // Correo de pruebas. Cambiar a nextrackingmexico@gmail.com en producción.

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.nombre || '',
      data.telefono || '',
      data.email || '',
      data.tipo_unidad || '',
      data.mensaje || '',
      data.pagina || '',
      data.origen || '',
    ]);

    sendNotificationEmail_(data);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Fecha', 'Nombre', 'Teléfono', 'Correo', 'Tipo de unidad', 'Mensaje', 'Página', 'Origen']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendNotificationEmail_(data) {
  const subject = `Nuevo lead Nextracking: ${data.nombre || 'sin nombre'}`;
  const body = [
    'Nueva solicitud de cotización desde el sitio web:',
    '',
    `Nombre: ${data.nombre || '-'}`,
    `Teléfono: ${data.telefono || '-'}`,
    `Correo: ${data.email || '-'}`,
    `Tipo de unidad: ${data.tipo_unidad || '-'}`,
    `Mensaje: ${data.mensaje || '-'}`,
    `Página: ${data.pagina || '-'}`,
    `Fecha: ${data.fecha || new Date().toISOString()}`,
  ].join('\n');

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}
