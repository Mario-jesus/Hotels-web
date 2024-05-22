import LoginFormTemplate from "./templates/login.js";
import SignUpFormTemplate from "./templates/signup.js";
import Home from "../customer/templates/home.js";
import DetailUser from "./templates/detail.js";

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

            case "detail":
                let detailUser = new DetailUser();
                detailUser.load();
                break;

            default:
                let home = new Home();
                home.load();
                break;
        }
    }

    public load(): void {
        this.loadPage();
    }
}