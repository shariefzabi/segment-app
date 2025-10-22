## Segment App

Simple React app to create and save a customer segment using a right-side modal. Users can name a segment, add multiple schema fields via dropdowns, and POST the payload to a webhook.

### Features
- "Save segment" button opens a right-side modal with teal header
- Segment name input, helper message, legend for User vs Group traits
- Add schemas via dropdown; each added row has a colored dot and remove button
- Available options always exclude already-selected fields
- Posts JSON to a webhook; development proxy avoids browser CORS

### Tech
- React (Create React App)
- Component: `src/components/SegmentModal.js`
- Styles: `src/components/SegmentModal.css`

### Getting Started
1) Install
```
npm install
```
2) Start dev server
```
npm start
```
The app runs at http://localhost:3000

### Save Endpoint and CORS (Development)
This project forwards API calls to Webhook.site using CRA’s proxy:
- `package.json` contains:
```
"proxy": "https://webhook.site"
```
- The modal posts to the relative path:
```
/fbe4d0ba-5b71-4a9a-a53e-89df49c13b16
```
This avoids CORS issues in development without changing browser settings. If you edit `package.json`, restart `npm start`.

Production note: CRA’s proxy is dev-only. For production, use a small backend (server or serverless) to relay requests, or ensure CORS headers are set by the destination.

### Payload Format
Example payload sent on "Save the segment":
```json
{
  "segment_name": "last_10_days_blog_visits",
  "schema": [
    { "first_name": "First Name" },
    { "last_name": "Last Name" }
  ]
}
```

### Customize
- Schema options: edit `SCHEMA_OPTIONS` in `src/components/SegmentModal.js`.
- Trait color dot: `getTraitType` marks `account_name` as group, others as user; tweak as needed.
- UI: adjust styles in `src/components/SegmentModal.css` (right-side drawer, colors, spacing).

### File Structure (relevant)
- `src/App.js`: renders the Save Segment entry and mounts `SegmentModal`
- `src/components/SegmentModal.js`: modal UI and logic
- `src/components/SegmentModal.css`: component styles

### Scripts
```
npm start       # run dev server
npm run build   # production build
npm test        # tests (CRA default wiring)
```

### Troubleshooting
- If you see CORS in production builds, add a server relay or enable CORS on the webhook.
- If proxy changes don’t take effect, stop and restart the dev server.

