import {spawn} from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import {Readable} from 'node:stream'

export async function spawnAndPipeToStdio(command: string, args: Array<string>, cwd: string, prependArgsLength?: number): Promise<void> {
    if (!await isAbsolutePathToDirectory(cwd)) {
        throw new Error('cwd isn\'t a directory')
    }
    return new Promise((res, rej) => {
        const process = spawn(command, args, {cwd})
        const STDIO_PREPEND = createStdioLinePrepend(command, args, prependArgsLength)
        process.stdout.on('data', (data) => printStdoutFromSpawnedProcess(STDIO_PREPEND, data))
        process.stderr.on('data', (data) => printStderrFromSpawnedProcess(STDIO_PREPEND, data))
        process.on('exit', () => {
            if (process.exitCode !== 0) {
                rej('exit code ' + process.exitCode)
            } else {
                res()
            }
        })
        process.on('error', (err) => {
            console.log('ERROR', err)
            rej(err)
        })
    })
}

async function isAbsolutePathToDirectory(p: string): Promise<boolean> {
    if (!path.isAbsolute(p)) {
        return false
    }
    const stat = await fs.stat(p)
    return stat.isDirectory()
}

function createStdioLinePrepend(command: string, args: Array<string>, prependArgsLength?: number): string {
    if (args.length === 0) {
        return `[${command}]`
    } else {
        return `[${command} ${args.slice(0, prependArgsLength).join(' ')}]`
    }
}

const printStdoutFromSpawnedProcess = (prepend: string, data: Readable) => printFromSpawnedProcess(console.log, prepend, data)

const printStderrFromSpawnedProcess = (prepend: string, data: Readable) => printFromSpawnedProcess(console.error, prepend, data)

function printFromSpawnedProcess(log: any, prepend: string, data: Readable) {
    const lines = data.toString().trim().split('\n')
    for (const line of lines) {
        if (line.length) {
            log(prepend, line)
        }
    }
}
