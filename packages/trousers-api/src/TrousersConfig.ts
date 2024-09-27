import type {BankDataStore, TransactionDataStore} from '@eighty4/trousers-data-interfaces'
import type {TrousersService} from '@eighty4/trousers-service-interface'
import type {PlaidClientConfig} from './PlaidClient.js'

export interface TrousersConfig {
    plaidClientConfig: PlaidClientConfig
    bankDataStore: BankDataStore
    transactionDataStore: TransactionDataStore
    services: Array<TrousersService>
}
