import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {LinkConfig, PlaidClientConfig} from './PlaidClient'
import type {TrouserRestConfig} from './rest/TrouserRestConfig'
import type {TrouserRestProvider} from './rest/TrouserRestProvider'

export interface TrouserConfig {
    plaidClientConfig: PlaidClientConfig
    linkConfig: LinkConfig
    bankDataStore: BankDataStore
    restConfig: TrouserRestConfig
    restProvider: TrouserRestProvider
    transactionDataStore: TransactionDataStore
}
