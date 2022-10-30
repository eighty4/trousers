import type {BankDataStore, TransactionDataStore} from 'trousers-data-interfaces'
import type {Account, Balances, Bank, LinkedBank, Transaction} from 'trousers-domain'

import {DatabaseModels} from './DatabaseModels'

export class SequelizeDataStore implements BankDataStore, TransactionDataStore {

    constructor(private readonly models: DatabaseModels) {

    }

    initialize(): Promise<void> {
        return Promise.resolve()
    }

    async saveBank({bankId, name, primaryColor, logo}: Bank): Promise<void> {
        try {
            await this.models.Bank.create({bankId, name, primaryColor, logo})
        } catch (e: any) {
            if (e.name === 'SequelizeValidationError') {
                throw new Error(e.errors.map((e: any) => e.message).join(', '))
            } else {
                throw e
            }
        }
    }

    async findBank(bankId: string): Promise<Bank | undefined> {
        const result = await this.models.Bank.findOne({where: {bankId}})
        if (result !== null) {
            const {bankId, name, primaryColor, logo: logoBuffer} = result
            const logo = logoBuffer ? logoBuffer.toString() : logoBuffer
            return {bankId, name, primaryColor, logo}
        }
    }

    async saveLinkedBank({itemId, bankId, userId, accessToken}: LinkedBank): Promise<void> {
        try {
            await this.models.LinkedBank.create({itemId, bankId, userId, accessToken})
        } catch (e: any) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                throw new Error(`LinkedBank already exists with userId \`${userId}\` and bankId \`${bankId}\``)
            } else if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error(`LinkedBank.Bank foreign key \`${bankId}\` does not reference an existing Bank`)
            } else if (e.name === 'SequelizeValidationError') {
                throw new Error(e.errors.map((e: any) => e.message).join(', '))
            } else {
                throw e
            }
        }
    }

    async findLinkedAccountsByUserId(userId: string): Promise<Array<Bank>> {
        const linkedBanks = await this.models.LinkedBank.findAll({
            where: {userId},
            order: ['created'],
            include: {all: true, nested: true},
        })

        return linkedBanks.map(linkedBank => ({
            name: linkedBank.bank.name,
            bankId: linkedBank.bank.bankId,
            logo: linkedBank.bank.logo ? linkedBank.bank.logo.toString() : undefined,
            primaryColor: linkedBank.bank.primaryColor ? linkedBank.bank.primaryColor : undefined,
            accounts: linkedBank.accounts.map(linkedAccount => {
                let balances: Balances | undefined = undefined
                if (linkedAccount.balances) {
                    const source = linkedAccount.balances
                    balances = {
                        available: source.available ? parseFloat(source.available) : undefined,
                        current: source.current ? parseFloat(source.current) : undefined,
                        limit: source.limit ? parseFloat(source.limit) : undefined,
                        currencyCode: source.currencyCode,
                    }
                }
                return {
                    accountId: linkedAccount.linkedAccountId,
                    displayName: linkedAccount.displayName,
                    officialName: linkedAccount.officialName,
                    subtype: linkedAccount.subtype,
                    type: linkedAccount.type,
                    mask: linkedAccount.mask,
                    balances,
                }
            }),
        }))
    }

    async findLinkedBankByItemId(itemId: string): Promise<LinkedBank | undefined> {
        const result = await this.models.LinkedBank.findOne({where: {itemId}})
        if (result !== null) {
            const {bankId, userId, itemId, accessToken} = result
            return {bankId, userId, itemId, accessToken}
        }
    }

    async saveLinkedAccounts(linkedBank: LinkedBank, accounts: Array<Account>): Promise<void> {
        const withBalances = accounts.filter(acct => !!acct.balances)
        const withoutBalances = accounts.filter(acct => !acct.balances)

        if (withBalances.length && !withoutBalances.length) {
            await this.saveLinkedAccountsInternal(linkedBank, withBalances, true)
        } else if (!withBalances.length && withoutBalances.length) {
            await this.saveLinkedAccountsInternal(linkedBank, withoutBalances, false)
        } else {
            await Promise.all([
                this.saveLinkedAccountsInternal(linkedBank, withBalances, true),
                this.saveLinkedAccountsInternal(linkedBank, withoutBalances, false),
            ])
        }
    }

    async saveLinkedAccountsInternal(linkedBank: LinkedBank, accounts: Array<Account>, withBalances: boolean): Promise<void> {
        try {
            const accountModels = accounts.map(account => ({
                linkedAccountId: account.accountId,
                itemId: linkedBank.itemId,
                displayName: account.displayName,
                officialName: account.officialName,
                mask: account.mask,
                type: account.type,
                subtype: account.subtype,
                balances: withBalances ? {
                    linkedAccountId: account.accountId,
                    currencyCode: account.balances?.currencyCode,
                    available: account.balances?.available,
                    current: account.balances?.current,
                    limit: account.balances?.limit,
                } : undefined,
            }))
            await this.models.LinkedAccount.bulkCreate(accountModels, {
                validate: true,
                include: withBalances ? {model: this.models.AccountBalances, as: 'balances'} : undefined,
            })
        } catch (e: any) {
            if (e.name === 'AggregateError') {
                const errorMessage = e.errors.flatMap((aggErr: any) => {
                    return aggErr.errors.errors.map((bulkErr: any) => bulkErr.message)
                }).join(', ')
                throw new Error(errorMessage)
            } else if (e.name === 'SequelizeForeignKeyConstraintError') {
                throw new Error(`LinkedAccount.LinkedBank foreign key \`${linkedBank.itemId}\` does not reference an existing LinkedBank`)
            } else {
                throw e
            }
        }
    }

    async saveTransactions(userId: string, txs: Array<Transaction>): Promise<void> {

    }
}
