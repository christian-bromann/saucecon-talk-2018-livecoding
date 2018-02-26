import assert from 'assert'
import SauceConPage from './page_objects/saucecon.page'

describe('SauceCon 2018 website', () => {
    it('should have a correct title', () => {
        browser.url('/')
        assert.equal(SauceConPage.title, 'SauceCon 2018')
        debugger
    })
    
    it('should open the popup for the first key note', () => {
        SauceConPage.keynoteLink.click()
        assert.ok(SauceConPage.popup.isVisible())
    })
    
    it('should be able to close the popup', () => {
        SauceConPage.popupClose.click()
        browser.waitUntil(() => SauceConPage.popup.isVisible() === false)
    })
})