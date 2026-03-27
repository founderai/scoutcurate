const AFFILIATE_TAG = "scoutcurate-20"

export function buildAmazonSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName.trim())
  return `https://www.amazon.com/s?k=${query}&tag=${AFFILIATE_TAG}`
}

export function buildAmazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AFFILIATE_TAG}`
}
