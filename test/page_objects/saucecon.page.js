import Page from './page';

class SauceConPage extends Page {
    get keynoteLink () {
        return $("h4=Keynote #1")
    }

    get popup () {
        return $('.popup')
    }

    get popupClose () {
        return $('.popup-close')
    }
}

export default new SauceConPage()