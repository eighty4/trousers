import {Client} from '@elastic/elasticsearch'

import type {Transaction} from '../Transaction'
import type {TransactionDataStore} from './TransactionDataStore'
import type {BulkOperationType, MappingProperty} from '@elastic/elasticsearch/lib/api/types'

export class ElasticTxDataStore implements TransactionDataStore {

    private readonly es: Client

    constructor(es?: Client) {
        // todo externalize db connection
        this.es = es || new Client({node: 'http://localhost:9200'})
    }

    async initialize(): Promise<void> {
    }

    async saveTransactions(userId: string, txs: Array<Transaction>): Promise<void> {
        const index = ElasticTxDataStore.indexName(userId)
        const request = {
            index,
            body: txs.flatMap(tx => [{index: {}}, tx])
        }

        const response = await this.es.bulk(request)

        // todo what to do with errors?
        if (response.errors) {
            response.items.forEach(action => {
                const op = Object.keys(action)[0] as BulkOperationType
                const item = action[op]!
                if (item.error) {
                    console.log('tx es save error', userId, item.status, item.status)
                }
            })
        }
    }

    private static indexName(userId: string): string {
        return 'bank.tx.' + userId
    }

    async initIndex(userId: string, ignoreExistsException?: boolean): Promise<string> {
        const index = ElasticTxDataStore.indexName(userId)
        const properties: Record<string, MappingProperty> = {
            transactionId: {type: 'keyword'},
            accountId: {type: 'keyword'},
            amount: {type: 'float'},
            name: {type: 'text'},
            date: {type: 'date'},
        }
        try {
            await this.es.indices.create({index, mappings: {properties}})
        } catch (e: any) {
            if (!ignoreExistsException && ElasticTxDataStore.isErrorType(e, 'resource_already_exists_exception')) {
                throw e
            }
        }
        return index
    }

    private static isErrorType(e: any, type: string): boolean {
        return e.meta && e.meta.body && e.meta.body.type !== type
    }
}
