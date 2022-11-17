#!/usr/bin/env node

import {writeFiles} from './files/writeFiles'

const appDir = 'a-trousers-app'

console.log('creating a Trousers app in dir', appDir)

writeFiles(appDir).then(() => console.log('finished!'))
