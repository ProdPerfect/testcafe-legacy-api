// --------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// --------------------------------------------------------

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = {
    ACTION_FUNC_NAMES: ['click', 'rclick', 'dblclick', 'drag', 'type', 'wait', 'waitFor', 'hover', 'press', 'select', 'navigateTo', 'upload', 'screenshot'],

    ASSERTION_FUNC_NAMES: ['ok', 'notOk', 'eq', 'notEq']
};
module.exports = exports['default'];