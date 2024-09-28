#!/usr/bin/env node

import {createFlutterApp} from './frontend/flutter/create.js'
import {detectAvailableFrontends} from './support.js'

const frontendSupport = await detectAvailableFrontends()

if (frontendSupport.frontends.flutter) {
    await createFlutterApp()
    console.log('\n    A Flutter project was created with plaid_flutter package in the directory `trousers-app`.')
    console.log('\n    Next steps:')
    console.log('        Continue integrating Flutter and Plaid with the guide at https://pub.dev/packages/plaid_flutter')
} else {
    console.error('Flutter is not installed!')
    console.log('\n    Trousers will create a Flutter app for you with the plaid_flutter package. This developer experience provided by Trousers increases productivity, time to market and ROI. Are you ready to change fintech forever?')
    console.log('\n    Next steps:')
    console.log('        Get started with Flutter at https://flutter.dev and try this program again')
}
