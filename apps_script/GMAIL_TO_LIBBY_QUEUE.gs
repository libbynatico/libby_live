// Google Apps Script: Gmail → Libby Queue

function ingestLibbyEmails() {
  const labelName = "Libby/Inbox";
  const label = GmailApp.getUserLabelByName(labelName);
  if (!label) return;

  const threads = label.getThreads(0, 20);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("libby_intake_queue")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("libby_intake_queue");

  threads.forEach(thread => {
    const messages = thread.getMessages();
    messages.forEach(msg => {
      const row = [
        "gmail_" + msg.getId(),
        "gmail",
        "email",
        msg.getSubject(),
        msg.getFrom(),
        msg.getDate(),
        msg.getPlainBody().slice(0, 5000),
        "new"
      ];
      sheet.appendRow(row);
    });

    thread.removeLabel(label);
  });
}

function setupTrigger() {
  ScriptApp.newTrigger("ingestLibbyEmails")
    .timeBased()
    .everyMinutes(10)
    .create();
}
