import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'
import type {TrousersService} from 'trousers-service-interface'

import {PlaidClient, type PlaidClientConfig} from './PlaidClient'
import {TrousersApi} from './TrousersApi'
import type {TrousersComponents} from './TrousersComponents'
import type {TrousersConfig} from './TrousersConfig'

export class Trousers {

    static builder(): Trousers {
        return new Trousers()
    }

    static withConfig(config: Partial<TrousersConfig>): Trousers {
        return new Trousers(config)
    }

    static withPlaidCredentials(clientId: string, secret: string): Trousers {
        if (!clientId || !secret) {
            throw new Error('Trousers.withPlaidCredentials arguments are null or undefined')
        }
        return new Trousers({plaidClientConfig: {clientId, secret}})
    }

    private builder: TrousersBuilder

    constructor(config?: Partial<TrousersConfig>) {
        this.builder = new TrousersBuilder(config)
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

    withTrousersService(service: TrousersService): this {
        if (!service) {
            throw new Error('Trousers.withTrousersService service arg is null or undefined')
        }
        this.builder.services.push(service)
        return this
    }

    buildPlaidClient(): PlaidClient {
        const config = this.builder.createConfig()
        return new PlaidClient(config.plaidClientConfig)
    }

    buildTrousersApi(): TrousersApi {
        const config = this.builder.createConfig()
        const plaidClient = new PlaidClient(config.plaidClientConfig)
        return new TrousersApi(plaidClient, config.bankDataStore)
    }

    buildTrousersComponents(): TrousersComponents {
        const {plaidClientConfig, bankDataStore, transactionDataStore, services} = this.builder.createConfig()
        const plaidClient = new PlaidClient(plaidClientConfig)
        const trousersApi = new TrousersApi(plaidClient, bankDataStore)
        return {
            plaidClient,
            trousersApi,
            bankDataStore,
            transactionDataStore,
            services,
        }
    }

    async start(): Promise<TrousersComponents> {
        const components = this.buildTrousersComponents()

        await Promise.all([
            components.services.map(service => service.initialize()),
        ])

        await Promise.all([
            components.services.map(service => service.start()),
        ])

        return components
    }
}

class TrousersBuilder {
    plaidClientConfig: Partial<PlaidClientConfig> = {}
    bankDataStore?: BankDataStore
    transactionDataStore?: TransactionDataStore
    services: Array<TrousersService> = []

    constructor(config?: Partial<TrousersConfig>) {
        if (config) {
            if (config.plaidClientConfig) {
                this.plaidClientConfig = config.plaidClientConfig
            }
            if (config.bankDataStore) {
                this.bankDataStore = config.bankDataStore
            }
            if (config.transactionDataStore) {
                this.transactionDataStore = config.transactionDataStore
            }
        }
    }

    createConfig(): TrousersConfig {
        if (!this.plaidClientConfig) {
            throw new Error('PlaidClientConfig was not configured with Trousers.plaidClientConfig')
        }
        if (!this.plaidClientConfig.clientId) {
            throw new Error('PlaidClientConfig is was not configured with clientId at Trousers.plaidClientConfig.clientId')
        }
        if (!this.plaidClientConfig.secret) {
            throw new Error('PlaidClientConfig is was not configured with secret at Trousers.plaidClientConfig.secret')
        }
        if (!this.bankDataStore) {
            throw new Error('BankDataStore was not configured with Trousers.dataStore or Trousers.bankDataStore')
        }
        if (!this.transactionDataStore) {
            throw new Error('TransactionDataStore was not configured with Trousers.dataStore or Trousers.transactionDataStore')
        }
        return {
            plaidClientConfig: this.plaidClientConfig as PlaidClientConfig,
            bankDataStore: this.bankDataStore,
            transactionDataStore: this.transactionDataStore,
            services: this.services,
        }
    }
}

export default Trousers
