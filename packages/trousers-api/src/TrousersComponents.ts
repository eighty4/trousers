import type {BankDataStore, TransactionDataStore} from '@eighty4/trousers-data-interfaces'
import type {TrousersService} from '@eighty4/trousers-service-interface'
import type {PlaidClient} from './PlaidClient.js'
import type {TrousersApi} from './TrousersApi.js'

export interface TrousersComponents {
    plaidClient: PlaidClient
    trousersApi: TrousersApi
    bankDataStore: BankDataStore
    transactionDataStore: TransactionDataStore
    services: Array<TrousersService>
}
