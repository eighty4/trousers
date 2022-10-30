import type {Account, Bank, LinkedBank} from 'trousers-domain'

export interface BankDataStore {

    initialize(): Promise<void>

    findBank(bankId: string): Promise<Bank | undefined>

    findLinkedAccountsByUserId(userId: string): Promise<Array<Bank>>

    findLinkedBankByItemId(itemId: string): Promise<LinkedBank | undefined>

    saveBank(bank: Bank): Promise<void>

    saveLinkedBank(linkedBank: LinkedBank): Promise<void>

    saveLinkedAccounts(linkedBank: LinkedBank, accounts: Array<Account>): Promise<void>

}
