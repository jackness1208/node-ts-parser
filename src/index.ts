import fs from 'fs'
import path from 'path'
import {
  convertCompilerOptionsFromJson,
  readConfigFile,
  parseJsonSourceFileConfigFileContent,
  CompilerOptions,
  findConfigFile,
  ModuleKind,
  sys,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript'

const PREFIX = '[tp]'

export interface ParseTsOption {
  /** 作用域 */
  context?: string
  /** ts 文件路径 */
  file: string
}

type ParseTsResult<T=any> = [Error | undefined, T?]

export function parseTs<T=any>(op: ParseTsOption): ParseTsResult {
  const { file, context } = op
  let r: ParseTsResult<T> = [undefined]
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

  let compilerOption: CompilerOptions = {}
  const configFileName = findConfigFile(cwd, sys.fileExists, 'tsconfig.json')
  if (configFileName) {
    const configFile = readConfigFile(configFileName, sys.readFile)
    if (configFile.error) {
      r = [new Error(`${configFile.error.messageText}`)]
      return r
    }
    if (configFile.config?.compilerOptions) {
      compilerOption = configFile.config.compilerOptions
    }
  }

  compilerOption = {
    ...compilerOption,
    ...{
      sourceRoot: cwd,
      moduleResolution: ModuleResolutionKind.NodeJs,
      target: ScriptTarget.ESNext,
      module: ModuleKind.ESNext,
      strict: true,
      esModuleInterop: true,
      lib: ['dom', 'es2015', 'scripthost'],
      declarationDir: './output',
      declaration: false,
      outFile: outputPath
    }
  }

  // TODO:
  return r
}

module.exports = parseTs
