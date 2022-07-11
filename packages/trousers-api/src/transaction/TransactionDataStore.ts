import type {Transaction} from '../Transaction'

export interface TransactionDataStore {

    initialize(): Promise<void>

    saveTransactions(userId: string, txs: Array<Transaction>): Promise<void>
}
