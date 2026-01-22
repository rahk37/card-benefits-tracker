const issuerColors: Record<string, string> = {
  'Chase': '#0f172a',
  'American Express': '#1d4ed8',
  'Capital One': '#b91c1c',
  'Citi': '#1e3a8a',
  'Bank of America': '#1f2937',
  'Discover': '#b45309',
  'Wells Fargo': '#7f1d1d',
  'U.S. Bank': '#111827',
  'Barclays': '#0f172a',
  'Goldman Sachs': '#111827'
};

function makeCardSvg(label: string, color: string): string {
  const safeLabel = label.toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#0b0f1a"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="200" height="120" rx="14" fill="url(#bg)"/>
  <rect x="16" y="20" width="48" height="34" rx="6" fill="#d1d5db" opacity="0.9"/>
  <rect x="72" y="28" width="20" height="10" rx="4" fill="#cbd5f5" opacity="0.9"/>
  <text x="16" y="88" font-family="Segoe UI, Arial, sans-serif" font-size="14" fill="#e5e7eb" letter-spacing="1">${safeLabel}</text>
  <text x="16" y="104" font-family="Segoe UI, Arial, sans-serif" font-size="10" fill="#94a3b8">CREDIT CARD</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getIssuerImageUrl(issuer: string): string {
  const color = issuerColors[issuer] ?? '#1f2937';
  return makeCardSvg(issuer, color);
}
