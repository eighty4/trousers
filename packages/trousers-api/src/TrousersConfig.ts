import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {PlaidClientConfig} from './PlaidClient'

export interface TrousersConfig {
    plaidClientConfig: PlaidClientConfig
    bankDataStore: BankDataStore
    transactionDataStore: TransactionDataStore
}
