# node-ts-parser

用于 node 环境下 转换 typescript 文件 成 js 并且获取其内容

## 安装

```bash
yarn add node-ts-parser
```

## 使用

### typescript

```typescript
import { tsParser } from 'node-ts-parser'
const [error, config] = tsParser({ context: __dirname, file: 'path/to/yyl.config.ts' })
```

### js

```javascript
const { tsParse } = require('node-ts-parser')
const [error, config] = tsParser({ context: __dirname, file: 'path/to/yyl.config.ts' })
```
