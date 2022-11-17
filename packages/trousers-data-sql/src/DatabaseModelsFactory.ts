import {DatabaseModels} from './DatabaseModels'
import {type ConnectionOpts, parseDialectString} from './ConnectionOpts'

function envVarPresent(key: string): boolean {
    const envVar = process.env[key]
    if (!envVar) {
        return false
    }
    return envVar.length > 0
}

export class DatabaseModelsFactory {

    static create(): DatabaseModels {
        const opts: ConnectionOpts = {}
        if (envVarPresent('TROUSERS_SQL_DIALECT')) {
            opts.dialect = parseDialectString(process.env.TROUSERS_SQL_DIALECT!)
        }
        if (envVarPresent('TROUSERS_SQL_DATABASE')) {
            opts.database = process.env.TROUSERS_SQL_DATABASE
        }
        if (envVarPresent('TROUSERS_SQL_USERNAME')) {
            opts.username = process.env.TROUSERS_SQL_USERNAME
        }
        if (envVarPresent('TROUSERS_SQL_PASSWORD')) {
            opts.password = process.env.TROUSERS_SQL_PASSWORD
        }
        if (envVarPresent('TROUSERS_SQL_HOST')) {
            opts.host = process.env.TROUSERS_SQL_HOST
        }
        if (envVarPresent('TROUSERS_SQL_PORT')) {
            try {
                opts.port = parseInt(process.env.TROUSERS_SQL_PORT!, 10)
            } catch (e) {
                throw new Error(`environment variable TROUSERS_SQL_PORT is ${process.env.TROUSERS_SQL_PORT} and not a numerical value`)
            }
        }
        if (envVarPresent('TROUSERS_SQL_SCHEMA')) {
            opts.schema = process.env.TROUSERS_SQL_SCHEMA
        }
        return new DatabaseModels(opts)
    }
}
