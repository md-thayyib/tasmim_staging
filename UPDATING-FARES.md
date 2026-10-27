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

## Posting the same fares to the WhatsApp channel

You don't need to type the channel message. Open **https://tasmimtravels.com/post.html** (bookmark it on your phone):

1. After updating the sheet, wait about 5 minutes and tap **Reload from sheet**.
2. Check the message. You can edit it in the box before copying.
3. Tap **Copy post**, open the channel in WhatsApp, paste and send. (On a phone, **Share** opens the share menu instead.)

The page writes the post in the usual channel format: 🔥TASMIM TRAVELS🔥, a line per route with flags, ✈️ airline and 👜 baggage, then each date and price, and the booking number at the end. It only includes fares from today onwards. The page is hidden from Google, but anyone with the link can open it; it only shows the same fares as the website.

WhatsApp doesn't allow posting to a channel automatically, so the final paste-and-send is still done by you.

## Backup

If the sheet can't be reached, the site shows the fares saved in `fares.json` in this repo instead.
It only needs updating if you want a fresher backup; edit it on GitHub (pencil icon on https://github.com/md-thayyib/tasmim_staging/blob/main/fares.json) using the same fields.

The sheet link lives in `script.js` as `FARES_SHEET`. If you ever make a new sheet, publish it with
**File → Share → Publish to web → (the sheet) → Comma-separated values (.csv)** and replace that link.
