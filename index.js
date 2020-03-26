'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssMergeRules = require('postcss-merge-rules');
const postcssScss = require('postcss-scss');

const env = process.env.EMBER_ENV;
const isProduction = ['production'].includes(env);

module.exports = {
  name: require('./package').name,

  options: {
    sourcemaps: {
      enabled: true,
      extensions: ['js', 'scss'],
    },

    minifyCSS: {
      enabled: isProduction,
    },

    minifyJS: {
      enabled: isProduction,
    },

    fingerprint: {
      enabled: isProduction,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'svg'],
    },

    sassOptions: {
      extension: 'scss',
    },

    cssModules: {
      extension: 'module.scss',
      intermediateOutputPath: 'addon/styles/_modules.scss',
      plugins: [
        autoprefixer({
          sourcemap: !isProduction,
          cascade: false,
        }),
        postcssMergeRules(),
      ],
      postcssOptions: {
        syntax: postcssScss,
      },
    },
  },

  included() {
    this._super.included.apply(this, arguments);

    const modulesPath = path.join(
      this.project.root,
      'node_modules',
      'ember-bedrock',
      'node_modules',
    );

    this.options.sassOptions.includePaths = [path.join(modulesPath, 'normalize.css')];

    this.app = this._findHost();

    this.app.options = Object.assign({}, this.options, this.app.options);
    this.app.options.cssModules.intermediateOutputPath = 'app/styles/_modules.scss';
  },

  isDevelopingAddon: function () {
    return true;
  },
};
