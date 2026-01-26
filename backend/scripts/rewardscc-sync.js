const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.REWARDSCC_BASE_URL || 'https://rewardscc.com/api';
const API_KEY = process.env.REWARDSCC_API_KEY || process.env.REWARDSCC_API_TOKEN || '';
const CARDS_PATH = path.join(__dirname, '..', 'src', 'main', 'resources', 'cards.json');
const RAW_PATH = path.join(__dirname, 'rewardscc-raw.json');

const headers = API_KEY
  ? {
      Authorization: `Bearer ${API_KEY}`,
      'X-Api-Key': API_KEY
    }
  : {};

const normalizeName = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

const getField = (obj, keys) => {
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      return obj[key];
    }
  }
  return undefined;
};

const parseRate = (value) => {
  if (value === null || value === undefined) {
    return { rateValue: null, earnRate: null };
  }
  if (typeof value === 'number') {
    if (value > 1 && value <= 100) {
      return { rateValue: value / 100, earnRate: `${value}%` };
    }
    if (value <= 1) {
      return { rateValue: value, earnRate: `${(value * 100).toFixed(1)}%` };
    }
    return { rateValue: null, earnRate: null };
  }
  const text = String(value).trim();
  const percentMatch = text.match(/([0-9.]+)\s*%/i);
  if (percentMatch) {
    const rate = Number(percentMatch[1]);
    return { rateValue: rate / 100, earnRate: text };
  }
  const multiplierMatch = text.match(/([0-9.]+)\s*x/i);
  if (multiplierMatch) {
    const rate = Number(multiplierMatch[1]);
    return { rateValue: rate * 0.01, earnRate: text };
  }
  return { rateValue: null, earnRate: text };
};

const toCategorySlug = (label) =>
  (label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalizeRewards = (detail) => {
  const list = getField(detail, [
    'rewards',
    'rewardCategories',
    'categories',
    'earnRates',
    'earnings',
    'bonusCategories'
  ]);
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map((entry) => {
      const categoryLabel = getField(entry, ['category', 'name', 'label', 'type']);
      const rateField = getField(entry, ['rate', 'rateValue', 'value', 'multiplier', 'earnRate', 'percentage']);
      const { rateValue, earnRate } = parseRate(rateField);
      const cap = getField(entry, ['cap', 'limit', 'max', 'annualCap', 'spendCap']);
      const notes = getField(entry, ['notes', 'details', 'exclusions', 'terms']);

      if (!categoryLabel) {
        return null;
      }

      return {
        categoryLabel,
        categorySlug: toCategorySlug(categoryLabel),
        rateValue,
        earnRate,
        cap,
        notes
      };
    })
    .filter(Boolean);
};

const fetchJson = async (url) => {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`RewardsCC request failed (${response.status}) for ${url}`);
  }
  return response.json();
};

const main = async () => {
  if (!API_KEY) {
    console.error('Missing REWARDSCC_API_KEY. Set it before running this script.');
    process.exit(1);
  }

  const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf-8'));
  const list = await fetchJson(`${BASE_URL}/cards/list`);
  fs.writeFileSync(RAW_PATH, JSON.stringify(list, null, 2));

  const listItems = Array.isArray(list) ? list : list.cards || [];
  const listIndex = new Map(
    listItems
      .map((item) => {
        const id = getField(item, ['id', 'cardId']);
        const name = getField(item, ['name', 'cardName', 'title']);
        if (!id || !name) {
          return null;
        }
        return [normalizeName(name), { id, name, raw: item }];
      })
      .filter(Boolean)
  );

  let updated = 0;
  for (const card of cards) {
    const key = normalizeName(card.name);
    const match = listIndex.get(key);
    if (!match) {
      console.warn(`No RewardsCC match for card: ${card.name}`);
      continue;
    }

    const detail = await fetchJson(`${BASE_URL}/cards/${match.id}`);
    const rewards = normalizeRewards(detail);
    if (rewards.length === 0) {
      console.warn(`No reward categories found for card: ${card.name}`);
      continue;
    }

    const annualFee = getField(detail, ['annualFee', 'annual_fee', 'fee']);
    const annualFeeCents =
      typeof annualFee === 'number'
        ? Math.round(annualFee * 100)
        : card.annualFeeCents ?? null;
    const annualFeeDisplay =
      typeof annualFee === 'number'
        ? `$${annualFee}`
        : card.annualFee || '$0';

    card.annualFee = annualFeeDisplay;
    card.annualFeeCents = annualFeeCents;
    card.officialReference = getField(detail, ['officialUrl', 'issuerUrl', 'url']) || card.officialReference;
    card.rewardCategories = rewards.map((entry) => ({
      category: entry.categorySlug,
      earnRate: entry.earnRate || '',
      rateValue: entry.rateValue,
      notes: entry.notes || (entry.cap ? `Cap: ${entry.cap}` : null),
      monthlyCap: null
    }));
    card.categories = rewards.map((entry) => entry.categorySlug);
    updated += 1;
  }

  fs.writeFileSync(CARDS_PATH, JSON.stringify(cards, null, 2));
  console.log(`Updated ${updated} cards in cards.json.`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
