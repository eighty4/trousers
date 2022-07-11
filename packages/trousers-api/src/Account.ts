export interface Balances {
    available: number | null
    current: number | null
    limit: number | null
    currencyCode: string | null
    lastUpdated?: string | null
}

export interface Account {
    accountId: string
    mask: string | null
    displayName: string
    officialName: string | null
    type: string
    subtype: string | null
    balances: Balances
}
