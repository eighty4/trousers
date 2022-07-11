import type {TrouserApi} from '../TrouserApi'
import type {TrouserRestProvider} from './TrouserRestProvider'
import {TrouserRouteConfigurer} from './TrouserRouteConfigurer'

export const configureDataRoutes: TrouserRouteConfigurer = (api: TrouserApi, rest: TrouserRestProvider) => {
    rest.addHandlerFn('GET', '/accounts', async (req, res) => {
        res.json(await api.getAllLinkedBankAccounts(req.authed.userId)).send()
    })
}
