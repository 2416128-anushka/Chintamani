# Chintamani + Gnani STT POC

This version uses a tiny Node/Express proxy because the Gnani STT endpoint does not expose browser CORS headers. The browser records audio and POSTs it to `/api/transcribe`; the Node process forwards it to Gnani and returns the transcript.

## 1. Requirements

- Node.js 18 or newer
- A Gnani API key
- Chrome or another modern browser with microphone permission

## 2. Install dependencies

Open a terminal in this folder and run:

```bash
npm install
```

## 3. Set the Gnani API key

### macOS / Linux

```bash
export GNANI_API_KEY="YOUR_GNANI_API_KEY"
```

### Windows PowerShell

```powershell
$env:GNANI_API_KEY="YOUR_GNANI_API_KEY"
```

Do not put the key in `index.html`; the proxy keeps it server-side.

## 4. Start the POC

```bash
npm start
```

Then open:

http://localhost:3000

Do not double-click `index.html` or open it as `file://...`; the browser needs the local server so that the `/api/transcribe` route exists and microphone permissions work normally.

## 5. Test the API bridge

Open this URL in your browser:

http://localhost:3000/api/health

You should see something like:

```json
{"ok":true,"gnaniKeyConfigured":true}
```

## 6. Use the voice button

1. Sign in to the prototype.
2. Choose the profile.
3. Click `Voice`.
4. Allow microphone access.
5. Speak for a few seconds.
6. Click `Stop`.
7. The WAV recording is sent to `/api/transcribe`.
8. The Node proxy sends the multipart request to Gnani STT.
9. The returned `transcript` is inserted into the Chintamani request and the existing demo flow continues.

## Troubleshooting

### `EADDRINUSE`
Another process is already using port 3000. Stop it or run with another port:

```bash
PORT=3001 npm start
```

Then use http://localhost:3001.

### `GNANI_API_KEY is not configured`
Set the environment variable in the same terminal session where you run `npm start`.

### Microphone permission error
Use `http://localhost:3000` in Chrome and allow microphone access for the site.

### Gnani returns an error
Check the Agent Activity panel in the prototype and the terminal running Node for the response status/body.
