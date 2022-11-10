import {Trousers} from 'trousers-api'

const dataStore = new SequelizeDataStore()

Trousers.withPlaidCredentials('clientId', 'secret')
    .dataStore(dataStore)
    .start()
