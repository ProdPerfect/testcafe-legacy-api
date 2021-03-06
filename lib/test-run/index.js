'use strict';

var _inherits = require('babel-runtime/helpers/inherits').default;

var _classCallCheck = require('babel-runtime/helpers/class-call-check').default;

var _regeneratorRuntime = require('babel-runtime/regenerator').default;

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default').default;

exports.__esModule = true;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _readFileRelative = require('read-file-relative');

var _mustache = require('mustache');

var _mustache2 = _interopRequireDefault(_mustache);

var _prodperfectTestcafeHammerhead = require('prodperfect-testcafe-hammerhead');

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _testRunErrorType = require('../test-run-error/type');

var _testRunErrorType2 = _interopRequireDefault(_testRunErrorType);

var _testRunErrorFormattableAdapter = require('../test-run-error/formattable-adapter');

var _testRunErrorFormattableAdapter2 = _interopRequireDefault(_testRunErrorFormattableAdapter);

// Const
var TEST_RUN_TEMPLATE = _readFileRelative.readSync('../client/test-run/index.js.mustache');
var IFRAME_TEST_RUN_TEMPLATE = _readFileRelative.readSync('../client/test-run/iframe.js.mustache');

var LegacyTestRun = (function (_Session) {
    _inherits(LegacyTestRun, _Session);

    function LegacyTestRun(test, browserConnection, screenshotCapturer, warningLog, opts) {
        _classCallCheck(this, LegacyTestRun);

        var uploadsRoot = _path2.default.dirname(test.fixture.path);

        _Session.call(this, uploadsRoot);

        this.unstable = false;

        this.opts = opts;
        this.test = test;
        this.browserConnection = browserConnection;

        this.isFileDownloading = false;

        this.errs = [];
        this.nativeDialogsInfo = null;
        this.nativeDialogsInfoTimeStamp = 0;
        this.stepsSharedData = {};
        this.screenshotCapturer = screenshotCapturer;

        this.injectable.scripts.push('/testcafe-core.js');
        this.injectable.scripts.push('/testcafe-ui.js');
        this.injectable.scripts.push('/testcafe-automation.js');
        this.injectable.scripts.push('/testcafe-legacy-runner.js');
        this.injectable.styles.push('/testcafe-ui-styles.css');
    }

    // Service message handlers

    LegacyTestRun.prototype._getPayloadScript = function _getPayloadScript() {
        var sharedJs = this.test.fixture.getSharedJs();

        return _mustache2.default.render(TEST_RUN_TEMPLATE, {
            stepNames: JSON.stringify(this.test.stepData.names),
            testSteps: this.test.stepData.js,
            sharedJs: sharedJs,
            testRunId: this.id,
            browserId: this.browserConnection.id,
            browserHeartbeatUrl: this.browserConnection.heartbeatUrl,
            browserStatusUrl: this.browserConnection.statusDoneUrl,
            takeScreenshots: this.screenshotCapturer.enabled,
            takeScreenshotsOnFails: this.opts.takeScreenshotsOnFails,
            skipJsErrors: this.opts.skipJsErrors,
            nativeDialogsInfo: JSON.stringify(this.nativeDialogsInfo),
            selectorTimeout: this.opts.selectorTimeout
        });
    };

    LegacyTestRun.prototype._getIframePayloadScript = function _getIframePayloadScript(iframeWithoutSrc) {
        var sharedJs = this.test.fixture.getSharedJs();
        var payloadScript = _mustache2.default.render(IFRAME_TEST_RUN_TEMPLATE, {
            sharedJs: sharedJs,
            takeScreenshotsOnFails: this.opts.takeScreenshotsOnFails,
            skipJsErrors: this.opts.skipJsErrors,
            nativeDialogsInfo: JSON.stringify(this.nativeDialogsInfo),
            selectorTimeout: this.opts.selectorTimeout
        });

        return iframeWithoutSrc ? 'var isIFrameWithoutSrc = true;' + payloadScript : payloadScript;
    };

    LegacyTestRun.prototype._addError = function _addError(err) {
        var screenshotPath, callsite, errAdapter;
        return _regeneratorRuntime.async(function _addError$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    screenshotPath = null;
                    callsite = err.__sourceIndex !== void 0 && err.__sourceIndex !== null && this.test.sourceIndex[err.__sourceIndex];
                    context$2$0.prev = 2;
                    context$2$0.next = 5;
                    return _regeneratorRuntime.awrap(this.screenshotCapturer.captureError(err));

                case 5:
                    screenshotPath = context$2$0.sent;
                    context$2$0.next = 10;
                    break;

                case 8:
                    context$2$0.prev = 8;
                    context$2$0.t0 = context$2$0['catch'](2);

                case 10:
                    errAdapter = new _testRunErrorFormattableAdapter2.default(err, {
                        userAgent: this.browserConnection.userAgent,
                        screenshotPath: screenshotPath,
                        callsite: callsite
                    });

                    this.errs.push(errAdapter);

                case 12:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this, [[2, 8]]);
    };

    LegacyTestRun.prototype._fatalError = function _fatalError(err) {
        return _regeneratorRuntime.async(function _fatalError$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    context$2$0.next = 2;
                    return _regeneratorRuntime.awrap(this._addError(err));

                case 2:
                    this.emit('done');

                case 3:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    LegacyTestRun.prototype.getAuthCredentials = function getAuthCredentials() {
        return this.test.fixture.authCredentials;
    };

    LegacyTestRun.prototype.handleFileDownload = function handleFileDownload() {
        this.isFileDownloading = true;
    };

    LegacyTestRun.prototype.handlePageError = function handlePageError(ctx, errMsg) {
        this._fatalError({
            type: _testRunErrorType2.default.pageNotLoaded,
            message: errMsg
        });

        ctx.redirect(this.browserConnection.forcedIdleUrl);
    };

    LegacyTestRun.prototype.start = function start() {
        return _regeneratorRuntime.async(function start$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                    // NOTE: required to keep API similar to TestRun. Just do nothing here.
                    this.emit('start');

                case 1:
                case 'end':
                    return context$2$0.stop();
            }
        }, null, this);
    };

    return LegacyTestRun;
})(_prodperfectTestcafeHammerhead.Session);

exports.default = LegacyTestRun;
var ServiceMessages = LegacyTestRun.prototype;

ServiceMessages[_command2.default.fatalError] = function (msg) {
    return this._fatalError(msg.err);
};

ServiceMessages[_command2.default.assertionFailed] = function (msg) {
    return this._addError(msg.err);
};

ServiceMessages[_command2.default.done] = function () {
    this.emit('done');
};

ServiceMessages[_command2.default.setStepsSharedData] = function (msg) {
    this.stepsSharedData = msg.stepsSharedData;
};

ServiceMessages[_command2.default.getStepsSharedData] = function () {
    return this.stepsSharedData;
};

ServiceMessages[_command2.default.getAndUncheckFileDownloadingFlag] = function () {
    var isFileDownloading = this.isFileDownloading;

    this.isFileDownloading = false;

    return isFileDownloading;
};

ServiceMessages[_command2.default.waitForFileDownload] = function () {
    // NOTE: required to keep API similar to TestRun. Just do nothing here.
};

ServiceMessages[_command2.default.nativeDialogsInfoSet] = function (msg) {
    if (msg.timeStamp >= this.nativeDialogsInfoTimeStamp) {
        //NOTE: the server can get messages in the wrong sequence if they was sent with a little distance (several milliseconds),
        // we don't take to account old messages
        this.nativeDialogsInfoTimeStamp = msg.timeStamp;
        this.nativeDialogsInfo = msg.info;
    }
};

ServiceMessages[_command2.default.takeScreenshot] = function callee$0$0(msg) {
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(this.screenshotCapturer.captureAction(msg));

            case 3:
                return context$1$0.abrupt('return', context$1$0.sent);

            case 6:
                context$1$0.prev = 6;
                context$1$0.t0 = context$1$0['catch'](0);
                return context$1$0.abrupt('return', null);

            case 9:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 6]]);
};
module.exports = exports.default;

// NOTE: swallow the error silently if we can't take screenshots for some
// reason (e.g. we don't have permissions to write a screenshot file).

// NOTE: swallow the error silently if we can't take screenshots for some
// reason (e.g. we don't have permissions to write a screenshot file).