export enum TrousersServiceStatus {
    CRASHED = 'CRASHED',
    CREATED = 'CREATED',
    INITIALIZED = 'INITIALIZED',
    RUNNING = 'RUNNING',
    STOPPED = 'STOPPED',
}

export interface TrousersService {
    initialize(): Promise<void>

    start(): Promise<void>

    status(): TrousersServiceStatus

    stop(): Promise<void>
}
