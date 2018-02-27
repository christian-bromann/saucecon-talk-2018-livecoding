import { expect } from 'chai';
import DynamicPage from '../pageobjects/dynamic.page';

let exceptions = []

describe('dynamic loading', () => {
    before(() => {
        browser.cdp('Runtime', 'enable')
        browser.on('Runtime.exceptionThrown', (data) => {
            exceptions.push(data.exceptionDetails.exception.description)
        });
    });

    it('should be an button on the page', () => {
        DynamicPage.open();
        expect(DynamicPage.loadedPage.isExisting()).to.be.equal(false);

        DynamicPage.btnStart.click();
        debugger;
        DynamicPage.loadedPage.waitForExist();
        expect(DynamicPage.loadedPage.isExisting()).to.be.equal(true);
    });

    after(() => {
        browser.url('http://the-internet.herokuapp.com/javascript_error')
        console.log(exceptions.map((error) => error + '\n').join('\n'));
        expect(exceptions).to.have.length(0)
    })
});
