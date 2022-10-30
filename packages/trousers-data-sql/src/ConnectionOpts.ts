type Dialect = 'mariadb' | 'mssql' | 'mysql' | 'postgres' | 'sqlite'

export interface ConnectionOpts {
    dialect?: Dialect
    database?: string
    username?: string
    password?: string
    host?: string
    port?: number
    schema?: string
}
