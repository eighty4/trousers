# trousers-data-elasticsearch

This package's [TransactionDataStore](../trousers-data-interfaces/src/TransactionDataStore.ts)
implementation contains the original operations used with Elasticsearch and
predates the Trousers monorepo and the [trousers-data-sql](../trousers-data-sql)
package using [Sequelize](https://sequelize.org/), which contains implementations of all data store types.

It is kept here as an example of how to implement a custom
[TransactionDataStore](../trousers-data-interfaces/src/TransactionDataStore.ts).
