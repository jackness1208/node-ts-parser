const { tsParser } = require('../../')
const path = require('path')

test('usage test', () => {
  const context = path.join(__dirname, '../case/yyl-config')
  const result = tsParser({ file: './yyl.config.ts', context })
  expect(result[0]).toEqual(undefined)
})
