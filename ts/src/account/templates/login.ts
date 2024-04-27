import FormTemplate from "../../hotelier/modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import utilities from "../../settings/modules/utilities.js";
import Session from "../../settings/modules/session.js";

export default class LoginFormTemplate extends FormTemplate {

    constructor() {
        super(
            urls_api.login,
            {redirectURL: urls_front.home, showMessage: false},
            "register",
        )
    }

    protected formTemplate(): string {
        let buttonName: string = "Login";

        return this.createForm("Inicia sesión", buttonName, [
            { type: { typeElement: "input", typeInput: "email" }, nameId: "Email", nameLabel: "Correo electronico", cls: "col-md-12" },
            { type: { typeElement: "input", typeInput: "password" }, nameId: "Password", nameLabel: "Contraseña", cls: "col-md-12" },
        ]);
    }

    protected async getFormAttributes() {
        try {
            const email = <string>this.validateField("inputEmail", "inputEmailFeedback", { typeElement: "text", required: true });
            const password = <string>this.validateField("inputPassword", "inputPasswordFeedback", { typeElement: "text", required: true });

            return { email, password };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let email = <HTMLInputElement>document.getElementById("inputEmail");
        let password = <HTMLInputElement>document.getElementById("inputPassword");

        let emailFeedback = <HTMLInputElement>document.getElementById("inputEmailFeedback");
        let passwordFeedback = <HTMLInputElement>document.getElementById("inputPasswordFeedback");

        return { email, password, emailFeedback, passwordFeedback };
    }

    protected eventFormError(resp: Response): void {
        let formElements = this.getFormElements();

        utilities.createAlert("Ha ocurrido un error al intentar iniciar sessión", "danger");

        if (!formElements.email.classList.contains("invalid-feedback")) formElements.email.classList.add("is-invalid");
        if (!formElements.emailFeedback.classList.contains("is-invalid")) formElements.emailFeedback.classList.add("invalid-feedback");
        if (!formElements.password.classList.contains("invalid-feedback")) formElements.password.classList.add("is-invalid");
        if (!formElements.passwordFeedback.classList.contains("is-invalid")) formElements.passwordFeedback.classList.add("invalid-feedback");

        formElements.emailFeedback.innerText = "Compruebe su correo electronico";
        formElements.passwordFeedback.innerText = "Compruebe la contraseña";

        throw new Error(resp.statusText);
    }

    protected eventFormSuccess(data: any): void {
        let session: Session = new Session();
        session.saveAccountData(data);
    }
}