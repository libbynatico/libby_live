import os, io, json, csv, datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

SCOPES = ['https://www.googleapis.com/auth/drive.readonly','https://www.googleapis.com/auth/spreadsheets']

FOLDER_ID = os.environ.get('LIBBY_DRIVE_INBOX_FOLDER_ID')
SPREADSHEET_ID = os.environ.get('LIBBY_LEDGER_SPREADSHEET_ID')

creds = service_account.Credentials.from_service_account_info(json.loads(os.environ['GOOGLE_SERVICE_ACCOUNT_JSON']), scopes=SCOPES)

drive = build('drive','v3',credentials=creds)
sheets = build('sheets','v4',credentials=creds)

def list_files():
    results = drive.files().list(q=f"'{FOLDER_ID}' in parents and trashed=false", fields="files(id,name,mimeType)").execute()
    return results.get('files', [])

def download_file(file_id):
    request = drive.files().get_media(fileId=file_id)
    fh = io.BytesIO()
    downloader = MediaIoBaseDownload(fh, request)
    done = False
    while done is False:
        status, done = downloader.next_chunk()
    fh.seek(0)
    return fh

def parse_csv(file_stream):
    text = file_stream.read().decode('utf-8', errors='ignore')
    rows = list(csv.reader(text.splitlines()))
    return rows

def append_rows(rows):
    body = {'values': rows}
    sheets.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID,
        range='01_raw_call_events!A2',
        valueInputOption='RAW',
        insertDataOption='INSERT_ROWS',
        body=body
    ).execute()


def main():
    files = list_files()
    for f in files:
        if f['name'].lower().endswith('.csv'):
            stream = download_file(f['id'])
            rows = parse_csv(stream)
            if len(rows) > 1:
                normalized = []
                for r in rows[1:]:
                    try:
                        normalized.append([
                            '001',
                            r[0],
                            r[1],
                            r[2],
                            '',
                            r[3],
                            r[4],
                            r[5] if len(r)>5 else '',
                            r[6] if len(r)>6 else ''
                        ])
                    except:
                        pass
                append_rows(normalized)
                print(f"Processed {f['name']}")

if __name__ == '__main__':
    main()
