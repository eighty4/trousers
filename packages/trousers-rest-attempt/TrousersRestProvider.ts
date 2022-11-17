import type {TrousersRestConfig} from './TrousersRestConfig'

export type HttpMethod = 'GET' | 'PATCH' | 'POST' | 'PUT' | 'DELETE'

export interface AuthedUser {
    userId: string
}

export interface RestRequest {
    authed: AuthedUser
    body: any
    path: string
}

export interface RestResponse {
    status(code: number): this
    send(msg?: any): this
    json(msg: any): this
}

export type HandlerFn = (req: RestRequest, res: RestResponse) => Promise<void>

export interface TrousersRestProvider {
    configure(): void
    addHandlerFn(method: HttpMethod, path: string, fn: HandlerFn): void
    start(cfg: TrousersRestConfig): Promise<void>
}
