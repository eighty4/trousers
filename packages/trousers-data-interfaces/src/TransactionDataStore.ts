import type {Transaction} from 'trousers-domain'

export interface TransactionDataStore {

    initialize(): Promise<void>

    saveTransactions(userId: string, txs: Array<Transaction>): Promise<void>

}
