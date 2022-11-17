export const dialects = ['mariadb', 'mssql', 'mysql', 'postgres', 'sqlite'] as const

export type Dialect = typeof dialects[number]

export function parseDialectString(maybeDialect: string): Dialect {
    if (dialects.includes(maybeDialect as Dialect)) {
        return maybeDialect as Dialect
    } else {
        throw new Error(maybeDialect + ' is not a valid sql dialect (mariadb | mssql | mysql | postgres | sqlite)')
    }
}

export interface ConnectionOpts {
    dialect?: Dialect
    database?: string
    username?: string
    password?: string
    host?: string
    port?: number
    schema?: string
}
