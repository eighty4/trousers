import type {TrousersRouteConfigurer} from './TrousersRouteConfigurer'
import type {TrousersRestProvider} from './TrousersRestProvider'
import type {TrousersApi} from '../TrousersApi'

export const configureLinkRoutes: TrousersRouteConfigurer = (api: TrousersApi, rest: TrousersRestProvider) => {
    rest.addHandlerFn('GET', '/plaid/link', async (req, res) => {
        try {
            const linkTokenResponse = await api.createLinkToken(req.authed.userId)
            res.status(201).json(linkTokenResponse).send()
        } catch (e) {
            res.status(500).send()
        }
    })

    rest.addHandlerFn('POST', '/plaid/link', async (req, res) => {
        if (!req.body.publicToken || !req.body.bankId) {
            res.status(400).send('must set bankId and publicToken')
        } else {
            try {
                const bank = await api.linkBank({
                    bankId: req.body.bankId,
                    publicToken: req.body.publicToken,
                    userId: req.authed.userId,
                })
                res.status(201).send()
            } catch (e) {
                res.status(500).send()
            }
        }
        console.log(req.path)
    })
}
