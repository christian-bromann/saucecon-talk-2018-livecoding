const assert = require('assert')

describe('SauceCon 2018 website', () => {
    it('should have a correct title', () => {
        browser.url('/')
        assert.equal(browser.getTitle(), 'SauceCon 2018')
    })
})