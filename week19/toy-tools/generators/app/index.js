var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
    }

    collecting() {
        this.log('collecting');
    }
    creating() {
        this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'), { title: 'zyl-template' }
        );
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc')
          );
          this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc')
          );
          this.fs.copyTpl(
            this.templatePath('main.test.js'),
            this.destinationPath('test/main.test.js')
          );
        this.fs.copyTpl(
            this.templatePath('createElement.js'),
            this.destinationPath('lib/createElement.js')
        );
        this.fs.copyTpl(
            this.templatePath('gesture.js'),
            this.destinationPath('lib/gesture.js')
        );
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
        );
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),{title:"zyls template"}
        );
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        );
        this.npmInstall([
            "@babel/core",
            "@babel/plugin-transform-react-jsx",
            "@babel/preset-env",
            "babel-loader",
            "babel-cli",
            'html-webpack-plugin',
            "css-loader",
            "webpack",
            "webpack-cli",
            "webpack-dev-server",
            "@istanbuljs/nyc-config-babel",
            "mocha",
            "@babel/register",
            "babel-plugin-istanbul",
            "nyc",
            "css"
        ], { 'save-dev': true });
        //   this.fs.copyTpl(this.templatePath('index.html'),this.destinationPath("public/index.html"),{title:"template with yeoman"})
    }
};