import Page from './page';

class FormPage extends Page {
    /**
     * define elements
     */
    get username () { return $('#username'); }
    get password () { return $('#password'); }
    get form () { return $('#login'); }
    get flash () { return $('#flash'); }

    /**
     * define or overwrite page methods
     */
    open () {
        return super.open('login');
    }

    submit () {
        this.form.submitForm();
    }
}

export default new FormPage()