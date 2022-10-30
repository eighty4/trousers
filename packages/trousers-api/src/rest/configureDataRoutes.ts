import type {TrouserRouteConfigurer} from './TrouserRouteConfigurer'
import type {TrouserRestProvider} from './TrouserRestProvider'
import type {TrouserApi} from '../TrouserApi'

export const configureDataRoutes: TrouserRouteConfigurer = (api: TrouserApi, rest: TrouserRestProvider) => {
    rest.addHandlerFn('GET', '/accounts', async (req, res) => {
        res.json(await api.findLinkedAccountsByUserId(req.authed.userId)).send()
    })
}
