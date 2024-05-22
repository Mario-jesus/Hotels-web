import FormTemplate from "../../hotelier/modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import utilities from "../../settings/modules/utilities.js";
import Session from "../../settings/modules/session.js";

export default class SignUpFormTemplate extends FormTemplate {

    constructor() {
        let reservationData = sessionStorage.getItem("reservationData");
        let redirectURL = reservationData ? urls_front.checkout: urls_front.home;
        super(
            urls_api.signup,
            { redirectURL, showMessage: false },
            "register",
        )
    }

    protected formTemplate(): string {
        let buttonName: string = "Registrarse";

        return this.createForm("Crear cuenta", buttonName, [
            { type: { typeElement: "input", typeInput: "email" }, nameId: "Email", nameLabel: "Correo electronico", cls: "col-md-12" },
            { type: { typeElement: "input", typeInput: "text" }, nameId: "Username", nameLabel: "Nombre de usuario", cls: "col-md-12" },
            { type: { typeElement: "input", typeInput: "password" }, nameId: "Password", nameLabel: "Contraseña", cls: "col-md-12" },
            { type: { typeElement: "checkbox" }, nameId: "Is_hotelier", nameLabel: "¿Es un hotelero?", cls: "col-md-12" },
        ]);
    }

    protected async getFormAttributes() {
        try {
            const email = <string>this.validateField("inputEmail", "inputEmailFeedback", { typeElement: "text", required: true });
            const username = <string>this.validateField("inputUsername", "inputUsernameFeedback", { typeElement: "text", required: true });
            const password = <string>this.validateField("inputPassword", "inputPasswordFeedback", { typeElement: "text", required: true });
            const is_hotelier = <boolean>this.validateField("inputIs_hotelier", "inputIs_hotelierFeedback", { typeElement: "checkbox", required: true });

            return { email, username, password, is_hotelier };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let email = <HTMLInputElement>document.getElementById("inputEmail");
        let username = <HTMLInputElement>document.getElementById("inputUsername");
        let password = <HTMLInputElement>document.getElementById("inputPassword");
        let is_hotelier = <HTMLInputElement>document.getElementById("inputIs_hotelier");

        let emailFeedback = <HTMLInputElement>document.getElementById("inputEmailFeedback");
        let usernameFeedback = <HTMLInputElement>document.getElementById("inputUsernameFeedback");
        let passwordFeedback = <HTMLInputElement>document.getElementById("inputPasswordFeedback");
        let is_hotelierFeedback = <HTMLInputElement>document.getElementById("inputIs_hotelierFeedback");

        return { email, username, password, is_hotelier, emailFeedback, usernameFeedback, passwordFeedback, is_hotelierFeedback };
    }

    protected eventFormError(resp: Response): Promise<void> {
        let errors: any;
        try {
            errors = resp.json();
        } catch(e) {
            errors = null;
        }

        console.log(errors); // Linea de prueba

        let formElements = this.getFormElements();

        utilities.createAlert("Ha ocurrido un error al intentar crear la cuenta", "danger");

        if (errors) {
            errors.then((data: any) => {
                for (let err in data) {
                    let element = document.getElementById(`input${err.charAt(0).toUpperCase()+err.substring(1)}Feedback`);
                    if (element) {
                        element.innerText = data[err][0];
                        // @ts-ignore
                        if (!formElements[err].classList.contains("invalid-feedback")) formElements[err].classList.add("is-invalid");
                        // @ts-ignore
                        if (!formElements[`${err}Feedback`].classList.contains("is-invalid")) formElements[`${err}Feedback`].classList.add("invalid-feedback");
                    }
                } 
            });
        }

        throw new Error(resp.statusText);
    }

    protected eventFormSuccess(data: any): void {
        let session: Session = new Session();
        session.saveAccountData(data);
    }
}