import type {TrousersRestProvider} from './TrousersRestProvider'
import type {TrousersApi} from '../TrousersApi'

export type TrousersRouteConfigurer = (api: TrousersApi, rest: TrousersRestProvider) => void
