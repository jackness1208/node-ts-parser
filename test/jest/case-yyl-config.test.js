const parseTs = require('../../')
const path = require('path')

test('usage test', () => {
  const context = path.join(__dirname, '../case/yyl-config')
  const result = parseTs({ file: './yyl.config.ts', context })
  expect(result[0]).toEqual(undefined)
})
