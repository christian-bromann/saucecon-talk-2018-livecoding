'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sauceConnectLauncher = require('sauce-connect-launcher');

var _sauceConnectLauncher2 = _interopRequireDefault(_sauceConnectLauncher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SauceLaunchService = function () {
    function SauceLaunchService() {
        _classCallCheck(this, SauceLaunchService);
    }

    _createClass(SauceLaunchService, [{
        key: 'onPrepare',

        /**
         * modify config and launch sauce connect
         */
        value: function onPrepare(config, capabilities) {
            var _this = this;

            if (!config.sauceConnect) {
                return;
            }

            this.sauceConnectOpts = _extends({
                username: config.user,
                accessKey: config.key
            }, config.sauceConnectOpts);

            config.protocol = 'http';
            config.host = 'localhost';
            config.port = this.sauceConnectOpts.port || 4445;

            var sauceConnectTunnelIdentifier = this.sauceConnectOpts.tunnelIdentifier;

            if (sauceConnectTunnelIdentifier) {
                if (Array.isArray(capabilities)) {
                    capabilities.forEach(function (capability) {
                        capability.tunnelIdentifier = capability.tunnelIdentifier || sauceConnectTunnelIdentifier;
                    });
                } else {
                    Object.keys(capabilities).forEach(function (browser) {
                        capabilities[browser].desiredCapabilities.tunnelIdentifier = capabilities[browser].desiredCapabilities.tunnelIdentifier || sauceConnectTunnelIdentifier;
                    });
                }
            }

            return new Promise(function (resolve, reject) {
                return (0, _sauceConnectLauncher2.default)(_this.sauceConnectOpts, function (err, sauceConnectProcess) {
                    if (err) {
                        return reject(err);
                    }

                    _this.sauceConnectProcess = sauceConnectProcess;
                    resolve();
                });
            });
        }

        /**
         * shut down sauce connect
         */

    }, {
        key: 'onComplete',
        value: function onComplete() {
            var _this2 = this;

            if (!this.sauceConnectProcess) {
                return;
            }

            return new Promise(function (resolve) {
                return _this2.sauceConnectProcess.close(resolve);
            });
        }
    }]);

    return SauceLaunchService;
}();

exports.default = SauceLaunchService;
module.exports = exports['default'];