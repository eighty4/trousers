import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {PlaidClientConfig} from './PlaidClient'
import type {TrouserConfig} from './TrouserConfig'
import type {TrouserRestProvider} from './rest/TrouserRestProvider'

class Trousers {

    static withClientConfig(cfg: PlaidClientConfig): Trousers {
        return new Trousers(cfg)
    }

    private cfg: Partial<TrouserConfig> = {}

    private constructor(plaidClientConfig: PlaidClientConfig) {
        this.cfg.plaidClientConfig = plaidClientConfig
    }

    bankDataStore(bankDataStore: BankDataStore): this {
        this.cfg.bankDataStore = bankDataStore
        return this
    }

    transactionDataStore(transactionDataStore: TransactionDataStore): this {
        this.cfg.transactionDataStore = transactionDataStore
        return this
    }

    restProvider(restProvider: TrouserRestProvider): this {
        this.cfg.restProvider = restProvider
        return this
    }

}

export default Trousers
