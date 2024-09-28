import {spawnAndPipeToStdio} from '../../spawn/piped.js'

export interface FlutterCreateOptions {
    org?: string
    projectDir: string
    projectName: string
}

export async function flutterCreate(opts: FlutterCreateOptions): Promise<void> {
    try {
        await spawnAndPipeToStdio('flutter', [
            'create',
            '--org', opts.org ?? 'trousers.fintech.flop',
            '--project-name', opts.projectName,
            opts.projectDir,
        ], process.cwd(), 1)
    } catch (e: any) {
        throw new Error('flutter create error: ' + e.message)
    }
}

export interface FlutterPubAddOptions {
    package: string
    projectDir: string
}

export async function flutterPubAdd(opts: FlutterPubAddOptions): Promise<void> {
    try {
        await spawnAndPipeToStdio('flutter', ['pub', 'add', opts.package], opts.projectDir)
    } catch (e: any) {
        throw new Error('flutter create error: ' + e.message)
    }
}
