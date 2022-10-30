# trousers-data-postgres

This package's [BankDataStore](../trousers-data-interfaces/src/BankDataStore.ts) implementation contains
the original database queries used with Postgres and
predates the Trousers monorepo and the [trousers-data-sql](../trousers-data-sql)
package using [Sequelize](https://sequelize.org/), which contains implementations of all data store types.

It is kept here as an example of how to implement a custom
[BankDataStore](../trousers-data-interfaces/src/BankDataStore.ts).
