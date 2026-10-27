# Updating the daily flight fares

The "Today's flight fares" section on tasmimtravels.com reads from the **Tasmim Fares** Google Sheet.
Edit the sheet and the website shows the change within about 5 minutes (Google refreshes published sheets on its own schedule). No GitHub editing is needed.

Fares whose date has already passed are hidden automatically, so you only need to add new ones. Delete old rows whenever you like.

## Adding fares (phone or computer)

Open the sheet in Google Sheets and add one row per fare:

| from | to | airline | baggage | date | price |
|------|----|---------|---------|------|-------|
| Mangalore | Abu Dhabi | IndiGo | 30+7 kg | 2026-10-28 | 13000 |
| Kannur | Bahrain | | | 2026-11-04 | 25200 |

- **date**: `2026-11-04` (year-month-day) is safest. `4/11/2026` (day/month/year) also works.
- **price**: in rupees. `13000`, `13,000` and `₹13,000` all work.
- **airline** and **baggage** can be left empty.
- Rows with the same from, to, airline and baggage are shown together on one card.
- Keep the headings in row 1 exactly as they are, and keep using the first tab of the sheet.

If Google changes a date into something else, select the date column and choose **Format → Number → Plain text**, then type the date again.

The sheet is published publicly so the website can read it, so only put fare information in it.

## Backup

If the sheet can't be reached, the site shows the fares saved in `fares.json` in this repo instead.
It only needs updating if you want a fresher backup; edit it on GitHub (pencil icon on https://github.com/md-thayyib/tasmim_staging/blob/main/fares.json) using the same fields.

The sheet link lives in `script.js` as `FARES_SHEET`. If you ever make a new sheet, publish it with
**File → Share → Publish to web → (the sheet) → Comma-separated values (.csv)** and replace that link.
