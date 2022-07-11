import type {TrouserRouteConfigurer} from './TrouserRouteConfigurer'

export interface TrouserRestConfig {
    routeConfigurers: Array<TrouserRouteConfigurer>
    port: number
}
