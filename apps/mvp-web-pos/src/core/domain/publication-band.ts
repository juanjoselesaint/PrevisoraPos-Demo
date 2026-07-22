const CARD_METADATA_PATTERN = /\s*\[cards:([^\]]+)\]\s*$/i

export function stripPublicationBandMetadata(publicationBand: string): string {
  const normalizedBand = publicationBand.trim()
  const withoutMetadata = normalizedBand.replace(CARD_METADATA_PATTERN, '').trim()
  return withoutMetadata || 'Sin promo'
}

export function parseCardInstallmentCaps(publicationBand: string): Record<string, number> {
  const match = publicationBand.match(CARD_METADATA_PATTERN)
  if (!match?.[1]) {
    return {}
  }

  return match[1]
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
    .reduce<Record<string, number>>((acc, item) => {
      const [cardId, rawCap] = item.split('=')
      const normalizedCardId = cardId?.trim()
      const parsedCap = Number.parseInt(rawCap?.trim() ?? '', 10)

      if (!normalizedCardId || !Number.isFinite(parsedCap) || parsedCap <= 0) {
        return acc
      }

      acc[normalizedCardId] = parsedCap
      return acc
    }, {})
}

export function buildPublicationBandWithCards(
  publicationBand: string,
  cardInstallmentCaps: Record<string, number>,
): string {
  const baseBand = stripPublicationBandMetadata(publicationBand)
  const encodedCards = Object.entries(cardInstallmentCaps)
    .filter(([, cap]) => Number.isFinite(cap) && cap > 0)
    .map(([cardId, cap]) => `${cardId}=${Math.round(cap)}`)

  if (encodedCards.length === 0) {
    return baseBand
  }

  return `${baseBand} [cards:${encodedCards.join(';')}]`
}
