import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {LinkConfig, PlaidClientConfig} from './PlaidClient'
import type {TrouserConfig} from './TrouserConfig'
import type {TrouserRestProvider} from './rest/TrouserRestProvider'
import {configureDataRoutes} from './rest/configureDataRoutes'
import {configureLinkRoutes} from './rest/configureLinkRoutes'

class TrousersBuilder {
    plaidClientConfig: PlaidClientConfig
    linkConfig: Partial<LinkConfig> = {}
    bankDataStore?: BankDataStore
    transactionDataStore?: TransactionDataStore
    restProvider?: TrouserRestProvider

    constructor(plaidClientConfig: PlaidClientConfig) {
        this.plaidClientConfig = plaidClientConfig
    }

    createConfig(): TrouserConfig {
        if (!this.restProvider) {
            throw new Error('TrouserRestProvider was not configured with Trousers.restProvider')
        }
        if (!this.bankDataStore) {
            throw new Error('BankDataStore was not configured with Trousers.dataStore or Trousers.bankDataStore')
        }
        if (!this.transactionDataStore) {
            throw new Error('TransactionDataStore was not configured with Trousers.dataStore or Trousers.transactionDataStore')
        }
        if (!this.linkConfig.appName) {
            this.linkConfig.appName = 'a Trousers app'
        }
        if (!this.linkConfig.webhookUrlPrefix) {
            this.linkConfig.webhookUrlPrefix = 'http://localhost:3001'
        }
        return {
            plaidClientConfig: this.plaidClientConfig,
            restProvider: this.restProvider,
            bankDataStore: this.bankDataStore,
            transactionDataStore: this.transactionDataStore,
            restConfig: {
                port: 8000,
                routeConfigurers: [
                    configureDataRoutes,
                    configureLinkRoutes,
                ],
            },
            linkConfig: this.linkConfig as LinkConfig,
        }
    }
}

class Trousers {

    static withPlaidCredentials(clientId: string, secret: string): Trousers {
        if (!clientId || !secret) {
            throw new Error('Trousers.withPlaidCredentials arguments are null or undefined')
        }
        return new Trousers({clientId, secret})
    }

    private builder: TrousersBuilder

    constructor(plaidClientConfig: PlaidClientConfig) {
        this.builder = new TrousersBuilder(plaidClientConfig)
    }

    linkConfig(linkConfig: LinkConfig): Trousers {
        if (!linkConfig) {
            throw new Error('Trousers.linkConfig is null or undefined')
        }
        this.builder.linkConfig = {
            ...this.builder.linkConfig,
            ...linkConfig,
        }
        return this
    }

    dataStore(dataStore: BankDataStore & TransactionDataStore): this {
        if (!dataStore) {
            throw new Error('Trousers.dataStore is null or undefined')
        }
        this.builder.bankDataStore = dataStore
        this.builder.transactionDataStore = dataStore
        return this
    }

    bankDataStore(bankDataStore: BankDataStore): this {
        if (!bankDataStore) {
            throw new Error('Trousers.bankDataStore is null or undefined')
        }
        this.builder.bankDataStore = bankDataStore
        return this
    }

    transactionDataStore(transactionDataStore: TransactionDataStore): this {
        if (!transactionDataStore) {
            throw new Error('Trousers.transactionDataStore is null or undefined')
        }
        this.builder.transactionDataStore = transactionDataStore
        return this
    }

    restProvider(restProvider: TrouserRestProvider): this {
        if (!restProvider) {
            throw new Error('Trousers.restProvider is null or undefined')
        }
        this.builder.restProvider = restProvider
        return this
    }

    start(): void {

    }
}

export default Trousers
