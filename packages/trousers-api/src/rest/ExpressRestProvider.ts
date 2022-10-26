import cors from 'cors'
import {default as express, type Express} from 'express'

import type {TrouserRestConfig} from './TrouserRestConfig'
import type {HandlerFn, HttpMethod, TrouserRestProvider} from './TrouserRestProvider'

declare global {
    namespace Express {
        interface Request {
            authed: {userId: string}
        }
    }
}

export class ExpressRestProvider implements TrouserRestProvider {

    private readonly app: Express

    constructor() {
        this.app = express()
    }

    configure(): void {
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use((req, res, next) => {
            // todo move `(req) => userId` fn to TrouserConfig
            req.authed = {userId: ''}
            next()
        })
    }

    addHandlerFn(method: HttpMethod, path: string, fn: HandlerFn) {
        switch (method) {
            case 'GET':
                this.app.get(path, fn)
                break
            case 'PATCH':
                this.app.patch(path, fn)
                break
            case 'POST':
                this.app.post(path, fn)
                break
            case 'PUT':
                this.app.put(path, fn)
                break
            case 'DELETE':
                this.app.delete(path, fn)
                break
        }
    }

    start(cfg: TrouserRestConfig): Promise<void> {
        return new Promise(res => this.app.listen(cfg.port, res))
    }
}
