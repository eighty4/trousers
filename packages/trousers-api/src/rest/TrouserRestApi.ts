import type {TrouserConfig} from '../TrouserConfig'
import {TrouserApi} from '../TrouserApi'

export class TrouserRestApi {
    private readonly api: TrouserApi
    private readonly cfg: TrouserConfig

    constructor(api: TrouserApi, cfg: TrouserConfig) {
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
