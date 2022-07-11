import Pool from 'pg-pool'

import type {Client} from 'pg'
import type {BankDataStore} from './BankDataStore'
import type {LinkedBank} from '../LinkedBank'
import {Bank} from '../Bank'
import {Account} from '../Account'

// todo parameterize db schema
export class PostgresBankDataStore implements BankDataStore {

    private readonly pg: Pool<Client>

    constructor(pg?: Pool<Client>) {
        // todo externalize db connection
        this.pg = pg || new Pool({
            database: 'eighty4',
            host: 'localhost',
            user: 'admin',
            password: 'admin',
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        })
    }

    async initialize(): Promise<void> {

    }

    async getLinkedBankByItemId(itemId: string): Promise<LinkedBank | undefined> {
        const q = `
            select *
            from eighty4_bank.linked_banks
            where linked_bank_id = $1`
        const result = await this.pg.query(q, [itemId])
        if (result.rows && result.rows.length) {
            const row = result.rows[0]
            return {
                itemId,
                accessToken: row.access_token,
                userId: row.user_id,
                bankId: row.bank_id,
            }
        }
    }

    async findBank(bankId: string): Promise<Bank | undefined> {
        const q = `
            select *
            from eighty4_bank.banks
            where bank_id = $1`
        const result = await this.pg.query(q, [bankId])
        if (result.rows && result.rows.length) {
            const row = result.rows[0]
            return {
                bankId,
                primaryColor: row.primary_color,
                logo: row.logo,
                name: row.name,
            }
        }
    }

    async saveBank(bank: Bank): Promise<void> {
        const q = `
            insert into eighty4_bank.banks (bank_id, logo, name, primary_color)
            values ($1, $2, $3, $4)`
        await this.pg.query(q, [bank.bankId, bank.logo, bank.name, bank.primaryColor])
    }

    async saveLinkedBank(linkedBank: LinkedBank): Promise<void> {
        const q = `
            insert into eighty4_bank.linked_banks (linked_bank_id, access_token, bank_id, user_id)
            values ($1, $2, $3, $4)`
        await this.pg.query(q, [linkedBank.itemId, linkedBank.accessToken, linkedBank.bankId, linkedBank.userId])
    }

    async saveAccounts(linkedBank: LinkedBank, accounts: Array<Account>): Promise<void> {
        let q = `
            insert into eighty4_bank.linked_accounts (linked_account_id, linked_bank_id, user_id, bank_id,
                                                      display_name, official_name, mask, currency_code,
                                                      balance_available, balance_current, balance_limit,
                                                      balances_updated_when, account_type, account_subtype)
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`
        const p = []
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i]
            p.push(
                account.accountId, linkedBank.itemId, linkedBank.userId, linkedBank.bankId,
                account.displayName, account.officialName, account.mask,
                account.balances.currencyCode, account.balances.available,
                account.balances.current, account.balances.limit,
                account.balances.lastUpdated || new Date(),
                account.type, account.subtype,
            )
            if (i > 0) {
                const offset = (i * 14) + 1
                q += `, ($${offset}, $${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}`
                q += `, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}`
                q += `, $${offset + 10}, $${offset + 11}, $${offset + 12}, $${offset + 13})`
            }
        }
        await this.pg.query(q, p)
    }

    async getAllLinkedBankAccounts(userId: string): Promise<Array<Bank>> {
        return Promise.resolve([])
    }
}
