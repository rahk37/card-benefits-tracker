const fs = require('fs');
const path = require('path');

const CARDS_PATH = path.join(__dirname, '..', 'src', 'main', 'resources', 'cards.json');
const AUDIT_PATH = path.join(__dirname, 'audited-rewards.json');

const normalizeName = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/\b(credit|card|rewards|cash|back|cashback)\b/g, '')
    .replace(/[^a-z0-9]+/g, '');

const toSlug = (label) =>
  (label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const mapCategory = (label) => {
  const text = label.toLowerCase();
  if (text.includes('supermarket') || text.includes('grocery')) return 'groceries';
  if (text.includes('stream')) return 'streaming';
  if (text.includes('restaurant') || text.includes('dining')) return 'dining';
  if (text.includes('drugstore')) return 'drugstores';
  if (text.includes('transit')) return 'transit';
  if (text.includes('gas')) return 'gas';
  if (text.includes('travel') || text.includes('airfare')) return 'travel';
  if (text.includes('rotating')) return 'cashback';
  if (text.includes('all other') || text.includes('all purchases') || text.includes('other purchases')) return 'cashback';
  return toSlug(label);
};

const splitCategories = (label) => {
  if (!label) return [];
  const lower = label.toLowerCase();
  if (lower.includes('transit') && lower.includes('gas')) {
    return ['transit', 'gas'];
  }
  return [mapCategory(label)];
};

const toEarnRate = (rate) => `${(rate * 100).toFixed(rate * 100 % 1 === 0 ? 0 : 1)}%`;

const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8'));
const cards = JSON.parse(fs.readFileSync(CARDS_PATH, 'utf-8'));

const auditIndex = new Map(
  audit.map((entry) => [normalizeName(entry.cardName), entry])
);

let updated = 0;
for (const card of cards) {
  const key = normalizeName(card.name);
  const direct = auditIndex.get(key);
  const alt = auditIndex.get(normalizeName(`${card.issuer} ${card.name}`));
  const match = direct || alt;
  if (!match) {
    continue;
  }

  const rewardCategories = [];
  const categories = new Set();

  for (const reward of match.rewards || []) {
    const mapped = splitCategories(reward.category);
    mapped.forEach((slug) => {
      categories.add(slug);
      rewardCategories.push({
        category: slug,
        earnRate: toEarnRate(reward.rate),
        rateValue: reward.rate,
        notes: reward.cap ? `Cap: ${reward.cap}.` : reward.notes || null,
        monthlyCap: null
      });
    });
  }

  card.annualFee = `$${match.annualFee}`;
  card.annualFeeCents = Math.round(match.annualFee * 100);
  card.rewardCategories = rewardCategories;
  card.categories = Array.from(categories);
  card.officialReference = match.officialReference;
  updated += 1;
}

fs.writeFileSync(CARDS_PATH, JSON.stringify(cards, null, 2));
console.log(`Updated ${updated} cards from audited data.`);
