import type {BankDataStore} from '@eighty4/trousers-data-interfaces'
import type {Bank, LinkedBank} from '@eighty4/trousers-domain'

import {BankSync} from './BankSync.js'
import type {LinkTokenResponse, PlaidClient} from './PlaidClient.js'

export interface LinkBankRequest {
    bankId: string
    publicToken: string
    userId: string
}

export class TrousersApi {

    constructor(private readonly plaid: PlaidClient,
                private readonly bankDataStore: BankDataStore) {
    }

    createLinkToken(userId: string): Promise<LinkTokenResponse> {
        return this.plaid.createLinkToken(userId)
    }

    async linkBank(request: LinkBankRequest): Promise<void> {
        const {accessToken, itemId} = await this.plaid.accessTokenExchange(request.publicToken)
        const linkedBank: LinkedBank = {
            accessToken,
            itemId,
            bankId: request.bankId,
            userId: request.userId,
        }
        await new BankSync(this.bankDataStore, this.plaid).saveLinkedBank(linkedBank)
    }

    findLinkedAccountsByUserId(userId: string): Promise<Array<Bank>> {
        return this.bankDataStore.findLinkedAccountsByUserId(userId)
    }
}
