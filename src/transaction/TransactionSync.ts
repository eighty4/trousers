import {DateTime} from 'luxon'

import type {BankDataStore} from '../bank/BankDataStore'
import type {PlaidClient, PageTransactionOpts} from '../PlaidClient'
import type {TransactionDataStore} from './TransactionDataStore'

class TransactionSync {
    private readonly bankDataStore: BankDataStore
    private readonly plaid: PlaidClient
    private readonly txDataStore: TransactionDataStore

    constructor(bankDataStore: BankDataStore, plaid: PlaidClient, txDataStore: TransactionDataStore) {
        this.bankDataStore = bankDataStore
        this.plaid = plaid
        this.txDataStore = txDataStore
    }

    async initialImport(itemId: string) {
        const now = DateTime.now()
        const startDate = now.minus({days: 31}).toFormat('yyyy-MM-dd')
        const endDate = now.toFormat('yyyy-MM-dd')
        return await this.txImport(itemId, {startDate, endDate})
    }

    async historicalImport(itemId: string) {
        const now = DateTime.now()
        const startDate = now.minus({years: 2, days: 1}).toFormat('yyyy-MM-dd')
        const endDate = now.minus({days: 29}).toFormat('yyyy-MM-dd')
        return this.txImport(itemId, {startDate, endDate})
    }

    async updateImport(itemId: string, count: number) {
        const now = DateTime.now()
        const startDate = now.minus({years: 2, days: 1}).toFormat('yyyy-MM-dd')
        const endDate = now.toFormat('yyyy-MM-dd')
        return this.txImport(itemId, {startDate, endDate, count})
    }

    private async txImport(itemId: string, opts: PageTransactionOpts) {
        const linkedBank = await this.bankDataStore.getLinkedBankByItemId(itemId)
        if (!linkedBank) {
            throw new Error('no linked bank with item id ' + itemId)
        }
        const {accessToken, userId} = linkedBank
        await this.plaid.pageTransactions(accessToken, opts, async (txs) => {
            await this.txDataStore.saveTransactions(userId, txs)
        })
    }
}
