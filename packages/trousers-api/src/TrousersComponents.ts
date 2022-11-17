import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {PlaidClient} from './PlaidClient'
import type {TrousersApi} from './TrousersApi'

export interface TrousersComponents {
    plaidClient: PlaidClient
    trousersApi: TrousersApi
    bankDataStore: BankDataStore
    transactionDataStore: TransactionDataStore
}
