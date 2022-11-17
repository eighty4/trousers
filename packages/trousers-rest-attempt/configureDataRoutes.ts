import type {TrousersRouteConfigurer} from './TrousersRouteConfigurer'
import type {TrousersRestProvider} from './TrousersRestProvider'
import type {TrousersApi} from '../TrousersApi'

export const configureDataRoutes: TrousersRouteConfigurer = (api: TrousersApi, rest: TrousersRestProvider) => {
    rest.addHandlerFn('GET', '/accounts', async (req, res) => {
        res.json(await api.findLinkedAccountsByUserId(req.authed.userId)).send()
    })
}
