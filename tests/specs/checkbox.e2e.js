import { expect } from 'chai';
import CheckboxPage from '../pageobjects/checkbox.page';

describe('checkboxes', () => {
    it('checkbox 2 should be enabled', () => {
        CheckboxPage.open();
        expect(CheckboxPage.firstCheckbox.isSelected()).to.be.equal(false);
        expect(CheckboxPage.lastCheckbox.isSelected()).to.be.equal(true);
    });

    it('checkbox 1 should be enabled after clicking on it', () => {
        CheckboxPage.open();
        expect(CheckboxPage.firstCheckbox.isSelected()).to.be.equal(false);
        CheckboxPage.firstCheckbox.click();
        expect(CheckboxPage.firstCheckbox.isSelected()).to.be.equal(true);
    });
});
