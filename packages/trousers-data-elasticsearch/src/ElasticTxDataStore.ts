import {Client} from '@elastic/elasticsearch'
import type {TransactionDataStore} from '@eighty4/trousers-data-interfaces'
import type {Transaction} from '@eighty4/trousers-domain'
import type {MappingProperty} from '@elastic/elasticsearch/lib/api/types.js'

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
            body: txs.flatMap(tx => [{index: {}}, tx]),
        }

        const response = await this.es.bulk(request)

        // todo what to do with errors?
        if (response.errors) {
            for (const item of response.items) {
                for (const [op, response] of Object.entries(item)) {
                    if (response.error) {
                        console.log('tx elasticsearch save error', userId, op, response.status)
                    }
                }
            }
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
