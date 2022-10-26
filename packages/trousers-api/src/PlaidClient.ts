import {join} from 'path'

import {Configuration, CountryCode, DepositoryAccountSubtype, PlaidApi, PlaidEnvironments, Products} from 'plaid'
import type {ItemPublicTokenExchangeRequest, LinkTokenCreateRequest, TransactionsGetRequest} from 'plaid/api'

import type {Account, Bank, Transaction} from 'trousers-domain'


export interface PlaidClientConfig {
    clientId: string
    secret: string
    env?: PlaidEnv
    version?: PlaidVersion
}

export type PlaidEnv = 'sandbox' | 'development' | 'production'

export type PlaidVersion = '2020-09-14'

export interface LinkConfig {
    appName: string
    webhookUrlPrefix: string
}

export interface LinkTokenResponse {
    linkToken: string
    expiration: string
    requestId: string
}

export interface AccessTokenResponse {
    accessToken: string
    itemId: string
    requestId: string
}

export interface PageTransactionOpts {
    startDate: string
    endDate: string
    count?: number
}

export type PageTransactionCallback = (txs: Array<Transaction>) => Promise<boolean | void>

export class PlaidClient {

    private readonly plaid: PlaidApi

    constructor(cfg: PlaidClientConfig, private readonly linkCfg: LinkConfig) {
        this.plaid = new PlaidApi(new Configuration({
            basePath: PlaidEnvironments[cfg.env || 'sandbox'],
            baseOptions: {
                headers: {
                    'PLAID-CLIENT-ID': cfg.clientId,
                    'PLAID-SECRET': cfg.secret,
                    'Plaid-Version': cfg.version || '2020-09-14',
                },
            },
        }))
    }

    async createLinkToken(clientUserId: string): Promise<LinkTokenResponse> {
        const request = this.createLinkTokenRequest(clientUserId)
        try {
            const response = await this.plaid.linkTokenCreate(request)
            return {
                linkToken: response.data.link_token,
                expiration: response.data.expiration,
                requestId: response.data.request_id,
            }
        } catch (e: any) {
            throw new Error('failed creating link token because ' + e.response.data.error_message)
        }
    }

    private createLinkTokenRequest(clientUserId: string): LinkTokenCreateRequest {
        return {
            client_name: this.linkCfg.appName,
            products: [Products.Auth, Products.Transactions],
            country_codes: [CountryCode.Us],
            language: 'en',
            account_filters: {
                depository: {
                    account_subtypes: [
                        DepositoryAccountSubtype.Checking,
                        DepositoryAccountSubtype.Savings,
                    ],
                },
            },
            user: {
                client_user_id: clientUserId,
            },
            webhook: join(this.linkCfg.webhookUrlPrefix, 'item'),
        }
    }

    async accessTokenExchange(publicToken: string): Promise<AccessTokenResponse> {
        const request: ItemPublicTokenExchangeRequest = {
            public_token: publicToken,
        }
        const response = await this.plaid.itemPublicTokenExchange(request)
        return {
            accessToken: response.data.access_token,
            itemId: response.data.item_id,
            requestId: response.data.request_id,
        }
    }

    async pageTransactions(accessToken: string, opts: PageTransactionOpts, cb: PageTransactionCallback): Promise<void> {
        let count = typeof opts.count === 'undefined' ? 100 : opts.count
        let offset = 0
        let response
        do {
            try {
                const request: TransactionsGetRequest = {
                    access_token: accessToken,
                    start_date: opts.startDate,
                    end_date: opts.endDate,
                    options: {
                        count,
                        offset,
                    },
                }
                response = await this.plaid.transactionsGet(request)
                console.log(`received transactions ${offset + 1}-${offset + response.data.transactions.length} out of ${response.data.total_transactions}`)
                const transactions: Array<Transaction> = response.data.transactions.map(tx => ({
                    transactionId: tx.transaction_id,
                    accountId: tx.account_id,
                    amount: tx.amount,
                    name: tx.name,
                    date: tx.date,
                }))
                const paging = await cb(transactions)
                if (paging === false) {
                    break
                }
            } catch (e: any) {
                console.log('error fetching transactions: ' + e.message)
                throw e
            }
            offset += count
        } while (response.data.total_transactions > offset)
    }

    async getInstitutionById(bankId: string): Promise<Bank> {
        const request = {
            institution_id: bankId,
            country_codes: [CountryCode.Us],
            options: {
                include_optional_metadata: true
            }
        }
        const response = await this.plaid.institutionsGetById(request)
        return {
            bankId,
            name: response.data.institution.name,
            logo: response.data.institution.logo || undefined,
            primaryColor: response.data.primary_color.substring(1).trim(),
        }
    }

    async getAccounts(accessToken: string): Promise<Array<Account>> {
        const request = {
            access_token: accessToken,
        }
        const response = await this.plaid.accountsGet(request)
        return response.data.accounts.map(acct => ({
            accountId: acct.account_id,
            mask: acct.mask,
            displayName: acct.name,
            officialName: acct.official_name,
            type: acct.type,
            subtype: acct.subtype,
            balances: {
                available: acct.balances.available,
                current: acct.balances.current,
                limit: acct.balances.limit,
                currencyCode: acct.balances.iso_currency_code || acct.balances.unofficial_currency_code,
                lastUpdated: acct.balances.last_updated_datetime,
            }
        }))
    }
}
