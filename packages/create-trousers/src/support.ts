import {commandInPath} from './spawn/command.js'

export enum Frontend {
    ASTRO = 'astro',
    FLUTTER = 'flutter',
    NEXT = 'next',
    REACT_NATIVE = 'react_native',
    SVELTE_KIT = 'svelte_kit',
}

export enum JavaScriptRuntime {
    BUN = 'bun',
    DENO = 'deno',
    NODE = 'node',
}

export interface FrontendSupport {
    frontends: Record<Frontend, boolean>
    jsRuntimes: Record<JavaScriptRuntime, boolean>
}

export async function detectAvailableFrontends(): Promise<FrontendSupport> {
    const jsRuntimes: Record<JavaScriptRuntime, boolean> = {
        [JavaScriptRuntime.BUN]: false,
        [JavaScriptRuntime.DENO]: false,
        [JavaScriptRuntime.NODE]: false,

    }
    const frontends: Record<Frontend, boolean> = {
        [Frontend.ASTRO]: false,
        [Frontend.FLUTTER]: false,
        [Frontend.NEXT]: false,
        [Frontend.REACT_NATIVE]: false,
        [Frontend.SVELTE_KIT]: false,
    }
    for (const frontend of Object.values(Frontend)) {
        frontends[frontend] = false
    }
    await Promise.all([
        commandInPath('bun').then((result) => {
            if (result) {
                jsRuntimes.bun = true
            }
        }),
        commandInPath('deno').then((result) => {
            if (result) {
                jsRuntimes.deno = true
            }
        }),
        commandInPath('npx').then((result) => {
            if (result) {
                jsRuntimes.node = true
            }
        }),
        commandInPath('flutter').then((result) => {
            if (result) {
                frontends.flutter = true
            }
        }),
    ])
    if (Object.values(jsRuntimes).some(available => available)) {
        frontends.astro = frontends.next = frontends.react_native = frontends.svelte_kit = true
    }
    return {frontends, jsRuntimes}
}
