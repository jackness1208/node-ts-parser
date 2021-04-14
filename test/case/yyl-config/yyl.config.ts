import { initYylConfig, InitYylConfigOption } from 'init-yyl-config'
const pkg = require('./package.json')

module.exports = initYylConfig({
  projectInfo: {
    name: pkg.name,
    srcRoot: './src'
  },
  commit: {
    revAddr: '',
    hostname: ''
  }
})
