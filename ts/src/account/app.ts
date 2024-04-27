import LoginFormTemplate from "./templates/login.js";
import SignUpFormTemplate from "./templates/signup.js";

export default class AppAccount {
    template: string | null;

    constructor() {
        this.template = new URLSearchParams(location.search).get("template");
    }

    private loadPage(): void {
        switch (this.template) {
            case "login":
                let loginTemplate: LoginFormTemplate = new LoginFormTemplate();
                loginTemplate.load();
                break;

            case "signup":
                let signupTemplate: SignUpFormTemplate = new SignUpFormTemplate();
                signupTemplate.load();
                break;

            default:
                break;
        }
    }

    public load(): void {
        this.loadPage();
    }
}