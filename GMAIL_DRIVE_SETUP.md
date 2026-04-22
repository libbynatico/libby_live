# Gmail/Drive Auto-Sync Setup
**Status**: Ready to configure  
**Latest**: 2026-04-22

---

## How It Works

1. **Click "🔄 Sync" button** in Libby Live header
2. System opens Google OAuth consent screen
3. Grant access to Gmail & Drive
4. Auto-extracts:
   - Upcoming meetings (from email subject lines)
   - Contacts (from email senders)
   - Medical documents (from Drive)
5. Briefing console auto-updates with real data
6. No manual data entry needed

---

## Setup Steps

### 1. Get Google API Credentials

Go to [Google Cloud Console](https://console.cloud.google.com/):

```
1. Create new project: "Libby Live"
2. Enable APIs:
   - Gmail API
   - Google Drive API
3. Create OAuth 2.0 credential (OAuth consent screen):
   - Type: Web application
   - Redirect URI: https://libbynatico.github.io/libby_live/.netlify/functions/gmail-drive-sync?action=callback
4. Copy Client ID and Client Secret
```

### 2. Set Netlify Environment Variables

Go to [Netlify Settings](https://app.netlify.com/sites/libbylive/settings):

```
Environment variables → Edit variables

Add:
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
SITE_URL=https://libbynatico.github.io/libby_live
```

### 3. Deploy & Test

```bash
git push origin main
# Netlify auto-deploys

Visit: https://libbynatico.github.io/libby_live/
Click: "🔄 Sync" button
Result: OAuth consent screen opens
```

---

## What Gets Extracted

### From Gmail
**Meetings**: Emails with subject containing:
- ODSP, meeting, appointment, review, etc.
- Extracted: date, time, attendee, subject

**Contacts**: Email senders (last 50 messages)
- Name, email, last contact date

### From Drive
**Documents**: Files named with keywords:
- medical, health, ODSP, hospital, etc.
- Extracted: name, type, link, last modified

---

## Sync Frequency

**Manual**: Click "🔄 Sync" to refresh  
**Auto** (future): Can set Netlify scheduled function to sync every hour

---

## Privacy & Security

- Tokens stored in Netlify encrypted environment
- Gmail/Drive access is read-only
- No data leaves your infrastructure
- Can revoke access anytime in Google Account

---

## If It Doesn't Work

**"Not authenticated" message**:
- Click auth link again
- Grant permissions
- Try sync

**"Sync failed"**:
- Check Netlify environment variables are set
- Check Google Cloud project has APIs enabled
- Check redirect URI matches exactly

**No meetings showing up**:
- Gmail needs emails with meeting keywords (ODSP, appointment, etc.)
- Drive needs documents with medical/health keywords
- Try sending test emails to yourself with "meeting" in subject

---

## Future Enhancements

- Auto-sync every hour (scheduled function)
- Extract medical records with OCR
- Parse appointment times (currently just dates)
- Extract diagnosis from medical documents
- Auto-populate evidence ledger from documents

---

**Status**: Ready to connect. Follow setup steps above.
