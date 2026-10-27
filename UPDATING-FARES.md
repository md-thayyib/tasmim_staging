# Updating the daily flight fares

The "Today's flight fares" section on tasmimtravels.com reads from `fares.json` in this repo.
Edit that one file and the website updates by itself about a minute later (Netlify redeploys on every change).

Fares whose date has already passed are hidden automatically, so you only need to add new ones.

## From your phone or computer (no tools needed)

1. Open https://github.com/md-thayyib/tasmim_staging/blob/main/fares.json and sign in.
2. Tap the pencil icon (**Edit this file**).
3. Change the `updated` date and add, edit or remove fare lines (see the format below).
4. Tap **Commit changes…** → **Commit changes**.
5. Wait about a minute and refresh https://tasmimtravels.com.

## Format

```json
{
    "updated": "2026-10-27",
    "fares": [
        { "from": "Mangalore", "to": "Abu Dhabi", "airline": "IndiGo", "baggage": "30+7 kg", "date": "2026-10-28", "price": 13000 },
        { "from": "Kannur", "to": "Bahrain", "airline": "", "baggage": "", "date": "2026-11-04", "price": 25200 }
    ]
}
```

- **date**: year-month-day, e.g. `2026-11-04` for 4 November.
- **price**: numbers only, in rupees, no commas or ₹ sign: `13000`.
- **airline** and **baggage** can be left empty `""`.
- Every fare line except the last one ends with a comma `,`.
- Lines with the same from, to, airline and baggage are shown together on one card.

If the file has a mistake (for example a missing comma), the section shows a "see today's fares on our WhatsApp channel" message instead of breaking the page. Fix the file and it comes back.

## Optional: use a Google Sheet instead

If editing a file is awkward, the fares can come from a Google Sheet:

1. Make a sheet with these column headings in row 1: `from`, `to`, `airline`, `baggage`, `date`, `price`. Select the `date` column and set **Format → Number → Plain text** before typing dates like `2026-11-04`, so Google doesn't change them.
2. **File → Share → Publish to web** → choose the sheet → **Comma-separated values (.csv)** → **Publish**, and copy the link.
3. In `script.js`, set `FARES_SOURCE` to that link instead of `'fares.json'`.

After that, changes in the sheet show on the site within a few minutes, with no commits needed.
