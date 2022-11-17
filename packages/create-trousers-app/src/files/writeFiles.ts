import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'

import appScriptFactory from './app'
import envFileFactory from './env'
import packageJsonFactory from './package'

export async function writeFiles(appDir: string) {
    await makeAppDir(appDir)

    await Promise.all([
        writeFile(join(appDir, '/app.js'), appScriptFactory(), 'utf-8'),
        writeFile(join(appDir, '/.env'), envFileFactory(), 'utf-8'),
        writeFile(join(appDir, '/package.json'), packageJsonFactory(), 'utf-8'),
    ])
}

async function makeAppDir(appDir: string) {
    try {
        await mkdir(appDir)
    } catch (e: any) {
        if (e.code === 'EEXIST') {
            console.log(appDir, 'already exists')
            console.log('exiting')
            process.exit(1)
        } else {
            throw e
        }
    }
}
