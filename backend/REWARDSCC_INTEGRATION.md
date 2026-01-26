# RewardsCC Data Integration

This app uses `cards.json` as its source of truth for reward rates. To keep data accurate and verifiable,
we sync card data from RewardsCC.

## Endpoints Used

- List: `GET https://rewardscc.com/api/cards/list`
- Detail: `GET https://rewardscc.com/api/cards/{cardId}`

## Required Environment Variables

- `REWARDSCC_API_KEY` (required)
- `REWARDSCC_BASE_URL` (optional, defaults to `https://rewardscc.com/api`)

## Run the Sync

From `backend/`:

```
node scripts/rewardscc-sync.js
```

## What the Script Does

- Matches RewardsCC cards to our `cards.json` by card name (case-insensitive).
- Fetches per-card reward categories, caps, annual fees, and official URLs.
- Normalizes into our schema:
  - `rewardCategories` with `category`, `earnRate`, `rateValue`, `notes`, `monthlyCap`
  - `annualFee` and `annualFeeCents`
  - `officialReference`
- Writes updates back to `cards.json`
- Logs warnings for missing cards or missing reward data.

## Notes

- If a card is missing from RewardsCC, it is left untouched.
- If RewardsCC fields differ, update the parsing logic in `scripts/rewardscc-sync.js`.
- The app does **not** guess rates when data is missing.

