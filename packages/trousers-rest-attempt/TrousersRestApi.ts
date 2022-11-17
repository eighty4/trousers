import type {TrousersApi} from '../TrousersApi'
import type {TrousersConfig} from '../TrousersConfig'

export class TrousersRestApi {
    private readonly api: TrousersApi
    private readonly cfg: TrousersConfig

    constructor(api: TrousersApi, cfg: TrousersConfig) {
        this.api = api
        this.cfg = cfg
    }

    configure() {
        this.cfg.restProvider.configure()
        this.cfg.restConfig.routeConfigurers
            .forEach(configureRoutes => configureRoutes(this.api, this.cfg.restProvider))
    }

    start() {
        this.cfg.restProvider
            .start(this.cfg.restConfig)
            .then(() => console.log('started'))
    }
}
