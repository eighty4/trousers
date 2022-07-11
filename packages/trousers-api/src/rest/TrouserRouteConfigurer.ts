import type {TrouserRestProvider} from './TrouserRestProvider'
import type {TrouserApi} from '../TrouserApi'

export type TrouserRouteConfigurer = (api: TrouserApi, rest: TrouserRestProvider) => void
