import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'

import type {LinkConfig, PlaidClientConfig} from './PlaidClient'
import {configureDataRoutes} from './rest/configureDataRoutes'
import {configureLinkRoutes} from './rest/configureLinkRoutes'
import {ExpressRestProvider} from './rest/ExpressRestProvider'
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

export const populateDefaultConfig = (cfg: Partial<TrouserConfig>) => {
    if (!cfg.restProvider) {
        cfg.restProvider = new ExpressRestProvider()
    }
    if (!cfg.bankDataStore) {
        throw new Error('no bank data store')
    }
    if (!cfg.transactionDataStore) {
        throw new Error('no transaction data store')
    }
    if (!cfg.restConfig) {
        cfg.restConfig = {
            routeConfigurers: [],
            port: 8000,
        }
    }
    if (!cfg.restConfig.routeConfigurers.length) {
        cfg.restConfig.routeConfigurers.push(
            configureDataRoutes,
            configureLinkRoutes,
        )
    }
    if (!cfg.linkConfig) {
        cfg.linkConfig = {
            appName: 'a Trouser app',
            webhookUrlPrefix: 'http://localhost:3001',
        }
    }
}
