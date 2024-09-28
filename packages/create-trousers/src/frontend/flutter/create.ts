import path from 'node:path'
import {flutterCreate, flutterPubAdd} from './cli.js'

export async function createFlutterApp(): Promise<void> {
    const projectDir = path.join(process.cwd(), 'trousers-app')
    await flutterCreate({projectName: 'trousers_app', projectDir})
    await flutterPubAdd({projectDir, package: 'plaid_flutter'})
}
