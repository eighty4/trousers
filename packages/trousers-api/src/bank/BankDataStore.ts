import type {Account, Bank, LinkedBank} from 'trousers-domain'

export interface BankDataStore {
    initialize(): Promise<void>

    getLinkedBankByItemId(itemId: string): Promise<LinkedBank | undefined>

    findBank(bankId: string): Promise<Bank | undefined>

    saveBank(bank: Bank): Promise<void>

    saveLinkedBank(linkedBank: LinkedBank): Promise<void>

    saveAccounts(linkedBank: LinkedBank, accounts: Array<Account>): Promise<void>

    getAllLinkedBankAccounts(userId: string): Promise<Array<Bank>>
}
