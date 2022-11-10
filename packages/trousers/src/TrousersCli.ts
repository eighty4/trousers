import yeoman from 'yeoman-environment'

const env = yeoman.createEnv()
    .register('./node_modules/generator-trousers/app')
    .run('trousers')
    .then(() => {
        console.log('success!')
    }, (err) => {
        console.log('error:', err)
    })
