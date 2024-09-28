import {exec} from 'node:child_process'

export async function commandInPath(command: string): Promise<boolean> {
    if (!/^[a-z0-9]+$/.test(command)) {
        throw new Error('command is not valid')
    }
    return new Promise((res) => {
        const process = exec('command -v ' + command, (err) => {
            if (err) {
                res(false)
            } else {
                res(process.exitCode === 0)
            }
        })
    })
}
