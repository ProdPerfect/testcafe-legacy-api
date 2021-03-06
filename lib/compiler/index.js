'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _Object$keys = require('babel-runtime/core-js/object/keys').default;

var _regeneratorRuntime = require('babel-runtime/regenerator').default;

var _getIterator = require('babel-runtime/core-js/get-iterator').default;

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

exports.__esModule = true;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _osFamily = require('os-family');

var _osFamily2 = _interopRequireDefault(_osFamily);

var _stripBom = require('strip-bom');

var _stripBom2 = _interopRequireDefault(_stripBom);

var _crypto = require('crypto');

var _url = require('url');

var _pinkie = require('pinkie');

var _pinkie2 = _interopRequireDefault(_pinkie);

var _legacy = require('./legacy');

var _requireReader = require('./require-reader');

var _requireReader2 = _interopRequireDefault(_requireReader);

var _utilsPromisify = require('../utils/promisify');

var _utilsPromisify2 = _interopRequireDefault(_utilsPromisify);

var readFile = _utilsPromisify2.default(fs.readFile);

function exists(filePath) {
    return new _pinkie2.default(function (resolve) {
        return fs.exists(filePath, resolve);
    });
}

var FIXTURE_RE = /(^|;|\s+)('|")@fixture\s+.+?\2/;
var PAGE_RE = /(^|;|\s+)('|")@page\s+.+?\2/;
var TEST_RE = /(^|;|\s+)('|")@test\2\s*\[('|").+?\3\]\s*=\s*\{/;

var CompilerAdapter = (function () {
    function CompilerAdapter(hammerheadProcessScript) {
        _classCallCheck(this, CompilerAdapter);

        this.cache = {
            requires: {},
            requireJsMap: {},
            sourceIndex: [],
            configs: {}
        };

        this.hammerheadProcessScript = hammerheadProcessScript;
        this.requireReader = new _requireReader2.default(this.cache.requires, this.hammerheadProcessScript);
    }

    CompilerAdapter._resolveConfigModules = function _resolveConfigModules(cfg, dirName) {
        if (cfg.modules) {
            _Object$keys(cfg.modules).forEach(function (name) {
                var mod = cfg.modules[name];

                if (Array.isArray(mod)) mod = mod.map(function (filePath) {
                    return path.resolve(dirName, filePath);
                });else mod = path.resolve(dirName, mod);

                cfg.modules[name] = mod;
            });
        }
    };

    CompilerAdapter._collectDirConfigs = function _collectDirConfigs(dirName) {
        var cfgs, dirHierarchy, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, dir, cfgPath, isExists, data, cfg;

        return _regeneratorRuntime.async(function _collectDirConfigs$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    cfgs = [];
                    dirHierarchy = dirName.split(path.sep).reduce(function (dirs, chunk) {
                        var dir = null;

                        if (dirs.length) dir = path.join(dirs[dirs.length - 1], chunk);else if (_osFamily2.default.win) dir = chunk;else dir = path.sep + chunk;

                        dirs.push(dir);

                        return dirs;
                    }, []);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    context$2$0.prev = 5;
                    _iterator = _getIterator(dirHierarchy);

                case 7:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        context$2$0.next = 23;
                        break;
                    }

                    dir = _step.value;
                    cfgPath = path.join(dir, 'test_config.json');
                    context$2$0.next = 12;
                    return _regeneratorRuntime.awrap(exists(cfgPath));

                case 12:
                    isExists = context$2$0.sent;

                    if (!isExists) {
                        context$2$0.next = 20;
                        break;
                    }

                    context$2$0.next = 16;
                    return _regeneratorRuntime.awrap(readFile(cfgPath));

                case 16:
                    data = context$2$0.sent;
                    cfg = JSON.parse(_stripBom2.default(data));

                    CompilerAdapter._resolveConfigModules(cfg, dir);
                    cfgs.push(cfg);

                case 20:
                    _iteratorNormalCompletion = true;
                    context$2$0.next = 7;
                    break;

                case 23:
                    context$2$0.next = 29;
                    break;

                case 25:
                    context$2$0.prev = 25;
                    context$2$0.t0 = context$2$0['catch'](5);
                    _didIteratorError = true;
                    _iteratorError = context$2$0.t0;

                case 29:
                    context$2$0.prev = 29;
                    context$2$0.prev = 30;

                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }

                case 32:
                    context$2$0.prev = 32;

                    if (!_didIteratorError) {
                        context$2$0.next = 35;
                        break;
                    }

                    throw _iteratorError;

                case 35:
                    return context$2$0.finish(32);

                case 36:
                    return context$2$0.finish(29);

                case 37:
                    return context$2$0.abrupt('return', cfgs);

                case 38:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[5, 25, 29, 37], [30,, 32, 36]]);
    };

    CompilerAdapter.prototype._getConfig = function _getConfig(filePath) {
        var dirName, cfg, cachedCfg, dirConfigs;
        return _regeneratorRuntime.async(function _getConfig$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    dirName = path.dirname(filePath);
                    cfg = {};
                    cachedCfg = this.cache.configs[dirName];

                    if (!cachedCfg) {
                        context$2$0.next = 7;
                        break;
                    }

                    cfg = cachedCfg;
                    context$2$0.next = 13;
                    break;

                case 7:
                    context$2$0.next = 9;
                    return _regeneratorRuntime.awrap(CompilerAdapter._collectDirConfigs(dirName));

                case 9:
                    dirConfigs = context$2$0.sent;

                    cfg = {
                        modules: {},
                        baseUrl: ''
                    };

                    dirConfigs.forEach(function (dirCfg) {
                        if (dirCfg.modules) {
                            _Object$keys(dirCfg.modules).forEach(function (name) {
                                cfg.modules[name] = dirCfg.modules[name];
                            });
                        }

                        if (dirCfg.baseUrl) cfg.baseUrl = _url.resolve(cfg.baseUrl, dirCfg.baseUrl);
                    });

                    this.cache.configs[dirName] = cfg;

                case 13:
                    return context$2$0.abrupt('return', cfg);

                case 14:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    CompilerAdapter.prototype._createLegacyCompilerPromise = function _createLegacyCompilerPromise(code, filename, modules) {
        var _this = this;

        return new _pinkie2.default(function (resolve, reject) {
            var legacyCompiler = new _legacy.Compiler(code, filename, modules, _this.requireReader, _this.cache.sourceIndex, _this.hammerheadProcessScript);

            legacyCompiler.compile(function (errs, out) {
                if (errs) {
                    var msg = 'There are test compilation errors:\n';

                    msg += errs.map(function (err) {
                        return ' * ' + _legacy.getErrMsg(err);
                    }).join('\n');

                    reject(new Error(msg));
                } else resolve(out);
            });
        });
    };

    CompilerAdapter.prototype._createTests = function _createTests(compiled, filePath, baseUrl, requireJsMapKey, remainderJs) {
        var _this2 = this;

        var fixture = {
            name: compiled.fixture,
            path: filePath,
            pageUrl: _url.resolve(baseUrl, compiled.page),
            authCredentials: compiled.authCredentials,
            getSharedJs: function () {
                return _this2.cache.requireJsMap[requireJsMapKey] + remainderJs;
            }
        };

        return _Object$keys(compiled.testsStepData).map(function (testName) {
            return {
                name: testName,
                sourceIndex: _this2.cache.sourceIndex,
                stepData: compiled.testsStepData[testName],
                fixture: fixture,
                isLegacy: true,
                pageUrl: fixture.pageUrl,
                authCredentials: fixture.authCredentials
            };
        });
    };

    CompilerAdapter.prototype.canCompile = function canCompile(code, filename) {
        return (/\.test\.js$/.test(filename) && FIXTURE_RE.test(code) && PAGE_RE.test(code) && TEST_RE.test(code)
        );
    };

    CompilerAdapter.prototype.getSupportedExtension = function getSupportedExtension() {
        return '.test.js';
    };

    CompilerAdapter.prototype.cleanUp = function cleanUp() {
        // NOTE: Do nothing.
    };

    CompilerAdapter.prototype.compile = function compile(code, filename) {
        var _ref, modules, baseUrl, compiled, hash, requireJsMap, remainderJs, requireJsMapKey;

        return _regeneratorRuntime.async(function compile$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this._getConfig(filename));

                case 2:
                    _ref = context$2$0.sent;
                    modules = _ref.modules;
                    baseUrl = _ref.baseUrl;
                    context$2$0.next = 7;
                    return _regeneratorRuntime.awrap(this._createLegacyCompilerPromise(code, filename, modules));

                case 7:
                    compiled = context$2$0.sent;
                    hash = _crypto.createHash('md5');
                    requireJsMap = this.cache.requireJsMap;
                    remainderJs = compiled.remainderJs;

                    hash.update(compiled.requireJs);

                    requireJsMapKey = hash.digest('hex');

                    if (!requireJsMap[requireJsMapKey]) requireJsMap[requireJsMapKey] = compiled.requireJs;

                    return context$2$0.abrupt('return', this._createTests(compiled, filename, baseUrl, requireJsMapKey, remainderJs));

                case 15:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    return CompilerAdapter;
})();

exports.default = CompilerAdapter;
module.exports = exports.default;

// NOTE: walk up in the directories hierarchy and collect test_config.json files

//NOTE: solve memory overuse issue by storing requireJs in the suite-level hash-based map
//(see: B237609 - Fixture file compiler memory overuse)