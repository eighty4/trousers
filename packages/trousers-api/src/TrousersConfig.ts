import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'
import type {TrousersService} from 'trousers-service-interface'

import type {PlaidClientConfig} from './PlaidClient'

export interface TrousersConfig {
    plaidClientConfig: PlaidClientConfig
    bankDataStore: BankDataStore
    transactionDataStore: TransactionDataStore
    services: Array<TrousersService>
}
