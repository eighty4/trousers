import {beforeEach, describe, expect, it} from 'vitest'
import type {Account, Bank, LinkedBank} from '@eighty4/trousers-domain'
import {DatabaseModels} from './DatabaseModels.js'
import {SequelizeDataStore} from './SequelizeDataStore.js'

const bank: Bank = {
    bankId: 'bankId',
    name: 'Another Bank',
}

const linkedBank: LinkedBank = {
    bankId: 'bankId',
    itemId: 'itemId',
    userId: 'userId',
    accessToken: 'accessToken',
}

const account: Account = {
    accountId: 'accountId',
    mask: '1234',
    displayName: 'displayName',
    officialName: 'officialName',
    type: 'type',
    subtype: 'subtype',
    balances: {
        available: 0,
        current: 0,
        limit: 0,
        currencyCode: 'usd',
    },
}

describe('SequelizeBankDataStore', () => {

    // const models = new DatabaseModels('sqlite::memory:')
    const models = new DatabaseModels({
        database: 'eighty4',
        username: 'admin',
        password: 'admin',
        dialect: 'postgres',
    })
    const bankDataStore = new SequelizeDataStore(models)

    beforeEach(() => models.syncSchemaWithDatabase())

    describe('saveBank', () => {

        it('saves bank to db', async () => {
            const bank = {
                bankId: 'bankId',
                name: 'Another Bank',
                primaryColor: '00ff00',
                logo: 'some image data woot woot',
            }
            await bankDataStore.saveBank(bank)

            const result = await models.Bank.findAll({where: {bankId: bank.bankId}})
            expect(result).toHaveLength(1)

            const found = result[0]
            expect(found.bankId).toEqual(bank.bankId)
            expect(found.primaryColor).toEqual(bank.primaryColor)
            expect(found.logo.toString()).toBe(bank.logo)
            expect(found.created).toBeDefined()
            expect(found.updated).toBeDefined()
        })

        describe('database constraints', () => {

            it('error when bankId is null', async () => {
                const bank = {name: 'My Bank', primaryColor: '00ff00'} as Bank
                expect(() => bankDataStore.saveBank(bank)).rejects.toThrow('Bank.bankId cannot be null')
            })

            it('error when name is null', async () => {
                const bank = {bankId: 'bankId', primaryColor: '00ff00'} as Bank
                expect(() => bankDataStore.saveBank(bank)).rejects.toThrow('Bank.name cannot be null')
            })

            it('error when primaryColor exceeds 6 char length', async () => {
                const bank = {bankId: 'bankId', name: 'My Bank', primaryColor: '#00ff00'} as Bank
                expect(() => bankDataStore.saveBank(bank)).rejects.toThrow('Validation len on primaryColor failed')
            })
        })
    })

    describe('findBank', () => {

        it('returns undefined when no bank', async () => {
            expect(await bankDataStore.findBank('not a bank id')).toBeUndefined()
        })

        it('returns required bank data', async () => {
            await models.Bank.create({
                bankId: 'bankId',
                name: 'My Bank',
            })
            const found = await bankDataStore.findBank('bankId')
            expect(found).toBeDefined()
            expect(found?.bankId).toBe('bankId')
            expect(found?.name).toBe('My Bank')
            expect(found?.primaryColor).toBeNull()
            expect(found?.logo).toBeNull()
        })

        it('returns all bank data', async () => {
            await models.Bank.create({
                ...bank,
                primaryColor: '000000',
                logo: 'some image data woot woot',
            })
            const found = await bankDataStore.findBank('bankId')
            expect(found).toBeDefined()
            expect(found?.bankId).toBe(bank.bankId)
            expect(found?.name).toBe(bank.name)
            expect(found?.primaryColor).toBe('000000')
            expect(found?.logo).toBe('some image data woot woot')
        })
    })

    describe('saveLinkedBank', () => {

        it('saves linked bank to db', async () => {
            await bankDataStore.saveBank(bank)
            await bankDataStore.saveLinkedBank(linkedBank)

            const result = await models.LinkedBank.findAll({where: {itemId: linkedBank.itemId}})
            expect(result).toHaveLength(1)

            const found = result[0]
            expect(found.bankId).toEqual(linkedBank.bankId)
            expect(found.itemId).toEqual(linkedBank.itemId)
            expect(found.userId).toBe(linkedBank.userId)
            expect(found.accessToken).toBe(linkedBank.accessToken)
            expect(found.created).toBeDefined()
            expect(found.updated).toBeDefined()
        })

        describe('database constraints', () => {

            it('error when bank does not exist', async () => {
                const invalidLinkedBank = {
                    ...linkedBank,
                    bankId: 'notabankId',
                }

                expect(() => bankDataStore.saveLinkedBank(invalidLinkedBank)).rejects.toThrow('LinkedBank.Bank foreign key `notabankId` does not reference an existing Bank')
            })

            it('error when userId and bankId link already exists', async () => {
                await bankDataStore.saveBank(bank)
                await bankDataStore.saveLinkedBank(linkedBank)

                expect(() => bankDataStore.saveLinkedBank(linkedBank)).rejects.toThrow('LinkedBank already exists with userId `userId` and bankId `bankId`')
            })

            it('error when itemId is null', async () => {
                await bankDataStore.saveBank({
                    bankId: 'bankId',
                    name: 'Another Bank',
                })

                const linkedBank = {
                    bankId: 'bankId',
                    userId: 'userId',
                    accessToken: 'accesstoken',
                }

                expect(() => bankDataStore.saveLinkedBank(linkedBank as LinkedBank)).rejects.toThrow('LinkedBank.itemId cannot be null')
            })

            it('error when userId is null', async () => {
                await bankDataStore.saveBank({
                    bankId: 'bankId',
                    name: 'Another Bank',
                })

                const linkedBank = {
                    bankId: 'bankId',
                    itemId: 'itemId',
                    accessToken: 'accesstoken',
                }

                expect(() => bankDataStore.saveLinkedBank(linkedBank as LinkedBank)).rejects.toThrow('LinkedBank.userId cannot be null')
            })

            it('error when bankId is null', async () => {
                await bankDataStore.saveBank({
                    bankId: 'bankId',
                    name: 'Another Bank',
                })

                const linkedBank = {
                    itemId: 'itemId',
                    userId: 'userId',
                    accessToken: 'accessToken',
                }

                expect(() => bankDataStore.saveLinkedBank(linkedBank as LinkedBank)).rejects.toThrow('LinkedBank.bankId cannot be null')
            })

            it('error when accessToken is null', async () => {
                await bankDataStore.saveBank({
                    bankId: 'bankId',
                    name: 'Another Bank',
                })

                const linkedBank = {
                    itemId: 'itemId',
                    bankId: 'bankId',
                    userId: 'userId',
                }

                expect(() => bankDataStore.saveLinkedBank(linkedBank as LinkedBank)).rejects.toThrow('LinkedBank.accessToken cannot be null')
            })
        })
    })

    describe('findLinkedAccountsByUserId', () => {

        it('returns single linked bank with single account', async () => {
            await bankDataStore.saveBank(bank)
            await bankDataStore.saveLinkedBank(linkedBank)
            await bankDataStore.saveLinkedAccounts(linkedBank, [account])

            const found = await bankDataStore.findLinkedAccountsByUserId('userId')
            expect(found).toHaveLength(1)
            const foundBank = found[0]
            expect(foundBank.bankId).toBe(bank.bankId)
            expect(foundBank.name).toBe(bank.name)
            expect(foundBank.logo).toBe(bank.logo)
            expect(foundBank.primaryColor).toBe(bank.primaryColor)

            expect(foundBank.accounts).toHaveLength(1)
            const foundAccount = foundBank.accounts?.at(0) as Account
            expect(foundAccount.displayName).toBe(account.displayName)
            expect(foundAccount.officialName).toBe(account.officialName)
            expect(foundAccount.accountId).toBe(account.accountId)
            expect(foundAccount.type).toBe(account.type)
            expect(foundAccount.subtype).toBe(account.subtype)
            expect(foundAccount.mask).toBe(account.mask)
            expect(foundAccount.balances).toBeDefined()
            expect(foundAccount.balances).toStrictEqual(account.balances)
        })

        it('returns single linked bank with multiple accounts', async () => {
            await bankDataStore.saveBank(bank)
            await bankDataStore.saveLinkedBank(linkedBank)
            const account1 = {...account, accountId: 'acct1'}
            const account2 = {...account, accountId: 'acct2'}
            const account3 = {...account, accountId: 'acct3'}
            await bankDataStore.saveLinkedAccounts(linkedBank, [account1, account2, account3])

            const found = await bankDataStore.findLinkedAccountsByUserId('userId')
            expect(found).toHaveLength(1)
            expect(found[0].accounts).toHaveLength(3)
            expect(found[0].accounts?.map(acct => acct.accountId)).toStrictEqual(['acct1', 'acct2', 'acct3'])
        })

        it('returns multiple linked banks', async () => {
            await bankDataStore.saveBank(bank)
            await bankDataStore.saveLinkedBank(linkedBank)
            await bankDataStore.saveLinkedAccounts(linkedBank, [account])

            const bank2 = {...bank, bankId: 'bank2'}
            const linkedBank2 = {...linkedBank, itemId: 'item2', bankId: 'bank2'}
            await bankDataStore.saveBank(bank2)
            await bankDataStore.saveLinkedBank(linkedBank2)
            const account2 = {...account, accountId: 'acct2'}
            const account3 = {...account, accountId: 'acct3'}
            await bankDataStore.saveLinkedAccounts(linkedBank2, [account2, account3])

            const found = await bankDataStore.findLinkedAccountsByUserId('userId')
            expect(found).toHaveLength(2)
            expect(found.map(bank => bank.bankId)).toStrictEqual(['bankId', 'bank2'])
            expect(found[0].accounts).toHaveLength(1)
            expect(found[1].accounts).toHaveLength(2)
        })
    })

    describe('saveLinkedAccounts', () => {

        beforeEach(async () => {
            await bankDataStore.saveBank(bank)
            await bankDataStore.saveLinkedBank(linkedBank)
        })

        it('saves one linked account to db', async () => {
            await bankDataStore.saveLinkedAccounts(linkedBank, [account])

            const result = await models.LinkedAccount.findAll({include: 'balances'})
            expect(result).toHaveLength(1)

            const foundLinkedAccount = result[0]
            expect(foundLinkedAccount.linkedAccountId).toEqual(account.accountId)
            expect(foundLinkedAccount.mask).toEqual(account.mask)
            expect(foundLinkedAccount.displayName).toBe(account.displayName)
            expect(foundLinkedAccount.officialName).toBe(account.officialName)
            expect(foundLinkedAccount.type).toBe(account.type)
            expect(foundLinkedAccount.subtype).toBe(account.subtype)
            expect(foundLinkedAccount.balances.linkedAccountId).toBe(account.accountId)
            expect(foundLinkedAccount.balances.available).toBe(account.balances?.available?.toString())
            expect(foundLinkedAccount.balances.current).toBe(account.balances?.current?.toString())
            expect(foundLinkedAccount.balances.limit).toBe(account.balances?.limit?.toString())
            expect(foundLinkedAccount.balances.currencyCode).toBe(account.balances?.currencyCode)
            expect(foundLinkedAccount.balances.created).toBeDefined()
            expect(foundLinkedAccount.balances.updated).toBeDefined()
            expect(foundLinkedAccount.created).toBeDefined()
            expect(foundLinkedAccount.updated).toBeDefined()
        })

        it('saves multiple linked accounts to db', async () => {
            const account1 = {...account, accountId: 'acct1'}
            const account2 = {...account, accountId: 'acct2'}
            const account3 = {...account, accountId: 'acct3'}
            await bankDataStore.saveLinkedAccounts(linkedBank, [account1, account2, account3])

            const result = await models.LinkedAccount.findAll({include: 'balances'})
            expect(result).toHaveLength(3)
        })

        it('saves linked account without optional balances object', async () => {
            const noBalances = {...account, balances: undefined}
            await bankDataStore.saveLinkedAccounts(linkedBank, [noBalances])

            const result = await models.LinkedAccount.findAll({include: 'balances'})
            expect(result).toHaveLength(1)

            const found = result[0]
            expect(found.balances).toBe(null)
            expect(found.created).toBeDefined()
            expect(found.updated).toBeDefined()
        })

        it('saves multiple linked accounts with and without optional balances object', async () => {
            const noBalances = {...account, accountId: 'noBalancesAccountId', balances: undefined}
            await bankDataStore.saveLinkedAccounts(linkedBank, [account, noBalances])

            const result = await models.LinkedAccount.findAll({include: 'balances'})
            expect(result).toHaveLength(2)
            expect(result.map(acct => acct.balances).filter(balances => !!balances)).toHaveLength(1)
        })

        describe('database constraints', () => {

            it('errors when linked bank reference is invalid', async () => {
                const invalidLinkedBank: LinkedBank = {...linkedBank}
                invalidLinkedBank.itemId = 'notTheLinkedBank'
                const account1 = {...account, accountId: 'acct1'}
                const account2 = {...account, accountId: 'acct2'}
                const account3 = {...account, accountId: 'acct3'}

                expect(() => bankDataStore.saveLinkedAccounts(invalidLinkedBank, [account1, account2, account3]))
                    .rejects
                    .toThrow('LinkedAccount.LinkedBank foreign key `notTheLinkedBank` does not reference an existing LinkedBank')
            })

            it('errors when accountId is null', async () => {
                const invalidAccount: Account = {...account}
                delete (invalidAccount as any).accountId

                expect(() => bankDataStore.saveLinkedAccounts(linkedBank, [invalidAccount]))
                    .rejects
                    .toThrow('LinkedAccount.linkedAccountId cannot be null')
            })

            it('errors when itemId is null', async () => {
                const invalidLinkedBank: LinkedBank = {...linkedBank}
                delete (invalidLinkedBank as any).itemId

                expect(() => bankDataStore.saveLinkedAccounts(linkedBank, [account]))
                    .rejects
                    .toThrow('LinkedAccount.itemId cannot be null')
            })

            it('errors when displayName is null', async () => {
                const invalidAccount: Account = {...account}
                delete (invalidAccount as any).displayName

                expect(() => bankDataStore.saveLinkedAccounts(linkedBank, [invalidAccount]))
                    .rejects
                    .toThrow('LinkedAccount.displayName cannot be null')
            })

            it('errors when accountType is null', async () => {
                const invalidAccount: Account = {...account}
                delete (invalidAccount as any).type

                expect(() => bankDataStore.saveLinkedAccounts(linkedBank, [invalidAccount]))
                    .rejects
                    .toThrow('LinkedAccount.type cannot be null')
            })
        })
    })

    describe('findLinkedBankByItemId', () => {

        it('returns undefined when no linked bank', async () => {
            expect(await bankDataStore.findLinkedBankByItemId('not a linked bank id')).toBeUndefined()
        })

        it('returns linked bank data', async () => {
            await models.Bank.create(bank as any)
            await models.LinkedBank.create(linkedBank as any)

            const found = await bankDataStore.findLinkedBankByItemId('itemId')
            expect(found).toBeDefined()
            expect(found?.bankId).toBe('bankId')
            expect(found?.itemId).toBe('itemId')
            expect(found?.userId).toBe('userId')
            expect(found?.accessToken).toBe('accessToken')
        })
    })
})
