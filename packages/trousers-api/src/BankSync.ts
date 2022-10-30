import type {BankDataStore} from 'trousers-data-interfaces'
import type {LinkedBank} from 'trousers-domain'

import type {PlaidClient} from './PlaidClient'

export class BankSync {

    constructor(private readonly bankDataStore: BankDataStore,
                private readonly plaid: PlaidClient) {
    }

    async saveLinkedBank(linkedBank: LinkedBank): Promise<void> {
        let bank = await this.bankDataStore.findBank(linkedBank.bankId)
        if (!bank) {
            console.log(`bank ${linkedBank.bankId} not found in db, fetching from plaid`)
            bank = await this.plaid.getInstitutionById(linkedBank.bankId)
            await this.bankDataStore.saveBank(bank)
        }
        await this.bankDataStore.saveLinkedBank(linkedBank)

        const accounts = await this.plaid.getAccounts(linkedBank.accessToken)
        await this.bankDataStore.saveLinkedAccounts(linkedBank, accounts)
    }
}
