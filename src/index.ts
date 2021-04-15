import fs from 'fs'
import path from 'path'
import {
  readConfigFile,
  CompilerOptions,
  findConfigFile,
  ModuleKind,
  sys,
  ModuleResolutionKind,
  ScriptTarget,
  transpileModule,
  flattenDiagnosticMessageText
} from 'typescript'

const PREFIX = '[tp]'

export interface TsParserOption {
  /** 作用域 */
  context?: string
  /** ts 文件路径 */
  file: string
}

type TsParserResult<T = any> = [Error | undefined, T?]

export function tsParser<T = any>(op: TsParserOption): TsParserResult<T> {
  const { file, context } = op
  let r: TsParserResult<T> = [undefined]
  let cwd = process.cwd()
  if (context) {
    cwd = path.resolve(cwd, context)
  }
  const targetPath = path.resolve(cwd, file)
  if (!fs.existsSync(targetPath)) {
    r = [new Error(`${PREFIX} file not exists: ${targetPath}`)]
    return r
  }

  const filename = path.basename(targetPath).replace(/\.tsx?$/, '')
  const outputPath = path.join(path.dirname(targetPath), `._${filename}.js`)

  let compilerOptions: CompilerOptions = {}
  const configFileName = findConfigFile(cwd, sys.fileExists, 'tsconfig.json')
  if (configFileName) {
    const configFile = readConfigFile(configFileName, sys.readFile)
    if (configFile.error) {
      r = [
        new Error(
          `parse tsconfig fail: ${flattenDiagnosticMessageText(
            configFile.error.messageText,
            sys.newLine
          )}`
        )
      ]
      return r
    }
    if (configFile.config?.compilerOptions) {
      compilerOptions = configFile.config.compilerOptions
    }
  }

  compilerOptions = {
    ...compilerOptions,
    ...{
      sourceRoot: cwd,
      moduleResolution: ModuleResolutionKind.NodeJs,
      target: ScriptTarget.ES2015,
      module: ModuleKind.CommonJS,
      strict: true,
      esModuleInterop: true,
      lib: ['dom', 'es2015', 'scripthost'],
      allowJs: true,
      declaration: false,
      outFile: outputPath
    }
  }

  const result = transpileModule(fs.readFileSync(targetPath).toString(), {
    compilerOptions: compilerOptions
  })

  if (result.diagnostics && result.diagnostics.length) {
    r = [new Error(`parse ${filename} fail: ${result.diagnostics.join(' ')}`)]
    return r
  }

  try {
    fs.writeFileSync(outputPath, result.outputText)
  } catch (er) {
    r = [er]
    return r
  }

  try {
    const f = require(outputPath)
    r = [undefined, f]
    fs.unlinkSync(outputPath)
  } catch (er) {
    r = [er]
    return r
  }
  return r
}
