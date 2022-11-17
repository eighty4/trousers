import type {TrousersRouteConfigurer} from './TrousersRouteConfigurer'

export interface TrousersRestConfig {
    routeConfigurers: Array<TrousersRouteConfigurer>
    port: number
}
