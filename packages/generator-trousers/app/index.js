const Generator = require('yeoman-generator')

module.exports = class extends Generator {

    constructor(args, opts) {
        super(args, opts)
    }

    initializing() {
    }

    async prompting() {
        console.log('prompting')
        this.cfg = await this.prompt([{
            type: 'input',
            name: 'name',
            message: 'your project name',
            default: this.appname,
        }])
    }

    configuring() {
        console.log(this.destinationRoot())
    }

    default() {
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('project/package.json'),
            {name: this.cfg.name},
        )
        this.fs.copyTpl(
            this.templatePath('index.js'),
            this.destinationPath('project/index.js'),
            {name: this.cfg.name},
        )
    }

    conflicts() {
    }

    install() {
    }

    end() {
    }
}
