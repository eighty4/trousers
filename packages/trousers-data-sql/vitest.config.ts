import type {ConfigEnv} from 'vitest/config'

export default (configEnv: ConfigEnv) => {
    return {
        test: {
            include: 'src/**/*.test.ts',
        },
    }
}
