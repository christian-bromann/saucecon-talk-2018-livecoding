'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var jobDataProperties = ['name', 'tags', 'public', 'build', 'custom-data'];

var SauceService = function () {
    function SauceService() {
        _classCallCheck(this, SauceService);
    }

    _createClass(SauceService, [{
        key: 'before',

        /**
         * gather information about runner
         */
        value: function before(capabilities) {
            this.sessionId = global.browser.sessionId;
            this.capabilities = capabilities;
            this.auth = global.browser.requestHandler.auth || {};
            this.sauceUser = this.auth.user;
            this.sauceKey = this.auth.pass;
            this.testCnt = 0;
            this.failures = 0; // counts failures between reloads
        }
    }, {
        key: 'getSauceRestUrl',
        value: function getSauceRestUrl(sessionId) {
            return 'https://saucelabs.com/rest/v1/' + this.sauceUser + '/jobs/' + sessionId;
        }
    }, {
        key: 'beforeSuite',
        value: function beforeSuite(suite) {
            this.suiteTitle = suite.title;
        }
    }, {
        key: 'beforeTest',
        value: function beforeTest(test) {
            if (!this.sauceUser || !this.sauceKey) {
                return;
            }

            /**
             * in jasmine we get Jasmine__TopLevel__Suite as title since service using test
             * framework hooks in order to execute async functions.
             * This tweak allows us to set the real suite name for jasmine jobs.
             */
            if (this.suiteTitle === 'Jasmine__TopLevel__Suite') {
                this.suiteTitle = test.fullName.slice(0, test.fullName.indexOf(test.name) - 1);
            }

            global.browser.execute('sauce:context=' + test.parent + ' - ' + test.title);
        }
    }, {
        key: 'afterSuite',
        value: function afterSuite(suite) {
            if (suite.hasOwnProperty('err')) {
                ++this.failures;
            }
        }
    }, {
        key: 'afterTest',
        value: function afterTest(test) {
            if (!test.passed) {
                ++this.failures;
            }
        }
    }, {
        key: 'beforeFeature',
        value: function beforeFeature(feature) {
            if (!this.sauceUser || !this.sauceKey) {
                return;
            }

            this.suiteTitle = feature.name || feature.getName();
            global.browser.execute('sauce:context=Feature: ' + this.suiteTitle);
        }
    }, {
        key: 'afterStep',
        value: function afterStep(feature) {
            if (
            /**
             * Cucumber v1
             */
            feature.failureException ||
            /**
             * Cucumber v2
             */
            typeof feature.getFailureException === 'function' && feature.getFailureException()) {
                ++this.failures;
            }
        }
    }, {
        key: 'beforeScenario',
        value: function beforeScenario(scenario) {
            if (!this.sauceUser || !this.sauceKey) {
                return;
            }

            var scenarioName = scenario.name || scenario.getName();
            global.browser.execute('sauce:context=Scenario: ' + scenarioName);
        }

        /**
         * update Sauce Labs job
         */

    }, {
        key: 'after',
        value: function after() {
            if (!this.sauceUser || !this.sauceKey) {
                return;
            }

            return this.updateJob(this.sessionId, this.failures);
        }
    }, {
        key: 'onReload',
        value: function onReload(oldSessionId, newSessionId) {
            if (!this.sauceUser || !this.sauceKey) {
                return;
            }

            this.sessionId = newSessionId;
            return this.updateJob(oldSessionId, this.failures, true);
        }
    }, {
        key: 'updateJob',
        value: function updateJob(sessionId, failures) {
            var _this = this;

            var calledOnReload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            return new Promise(function (resolve, reject) {
                return _request2.default.put(_this.getSauceRestUrl(sessionId), {
                    json: true,
                    auth: {
                        user: _this.sauceUser,
                        pass: _this.sauceKey
                    },
                    body: _this.getBody(failures, calledOnReload)
                }, function (e, res, body) {
                    if (e) {
                        return reject(e);
                    }
                    global.browser.jobData = body;
                    _this.failures = 0;
                    resolve(body);
                });
            });
        }

        /**
         * massage data
         */

    }, {
        key: 'getBody',
        value: function getBody(failures) {
            var calledOnReload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            var body = {};

            /**
             * set default values
             */
            body.name = this.suiteTitle;

            /**
             * add reload count to title if reload is used
             */
            if (calledOnReload || this.testCnt) {
                body.name += ' (' + ++this.testCnt + ')';
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = jobDataProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var prop = _step.value;

                    if (!this.capabilities[prop]) {
                        continue;
                    }

                    body[prop] = this.capabilities[prop];
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            body.passed = failures === 0;
            return body;
        }
    }]);

    return SauceService;
}();

exports.default = SauceService;
module.exports = exports['default'];