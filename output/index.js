/*!
 * node-ts-parser cjs 0.1.2
 * (c) 2020 - 2021 
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var path = require('path');
var typescript = require('typescript');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const PREFIX = '[tp]';
function tsParser(op) {
    var _a;
    const { file, context } = op;
    let r = [undefined];
    let cwd = process.cwd();
    if (context) {
        cwd = path__default['default'].resolve(cwd, context);
    }
    const targetPath = path__default['default'].resolve(cwd, file);
    if (!fs__default['default'].existsSync(targetPath)) {
        r = [new Error(`${PREFIX} file not exists: ${targetPath}`)];
        return r;
    }
    const filename = path__default['default'].basename(targetPath).replace(/\.tsx?$/, '');
    const outputPath = path__default['default'].join(path__default['default'].dirname(targetPath), `._${filename}.js`);
    let compilerOptions = {};
    const configFileName = typescript.findConfigFile(cwd, typescript.sys.fileExists, 'tsconfig.json');
    if (configFileName) {
        const configFile = typescript.readConfigFile(configFileName, typescript.sys.readFile);
        if (configFile.error) {
            r = [
                new Error(`parse tsconfig fail: ${typescript.flattenDiagnosticMessageText(configFile.error.messageText, typescript.sys.newLine)}`)
            ];
            return r;
        }
        if ((_a = configFile.config) === null || _a === void 0 ? void 0 : _a.compilerOptions) {
            compilerOptions = configFile.config.compilerOptions;
        }
    }
    compilerOptions = Object.assign(Object.assign({}, compilerOptions), {
        sourceRoot: cwd,
        moduleResolution: typescript.ModuleResolutionKind.NodeJs,
        target: typescript.ScriptTarget.ES2015,
        module: typescript.ModuleKind.CommonJS,
        strict: true,
        esModuleInterop: true,
        lib: ['dom', 'es2015', 'scripthost'],
        allowJs: true,
        declaration: false,
        outFile: outputPath
    });
    const result = typescript.transpileModule(fs__default['default'].readFileSync(targetPath).toString(), {
        compilerOptions: compilerOptions
    });
    if (result.diagnostics && result.diagnostics.length) {
        r = [new Error(`parse ${filename} fail: ${result.diagnostics.join(' ')}`)];
        return r;
    }
    try {
        fs__default['default'].writeFileSync(outputPath, result.outputText);
    }
    catch (er) {
        r = [er];
        return r;
    }
    try {
        const f = require(outputPath);
        r = [undefined, f];
        fs__default['default'].unlinkSync(outputPath);
    }
    catch (er) {
        r = [er];
        return r;
    }
    return r;
}

exports.tsParser = tsParser;
