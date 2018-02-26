import assert from 'assert'
import SauceConPage from './page_objects/saucecon.page'

describe('SauceCon 2018 website', () => {
    it('should have a correct title', () => {
        browser.url('/')
        assert.equal(SauceConPage.title, 'SauceCon 2018')
    })
})