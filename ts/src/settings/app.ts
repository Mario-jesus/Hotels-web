import NavTemplate from "./templates/nav.js";
import Session from "./modules/session.js";

export default class AppSettings {
    private session: Session;

    constructor() {
        this.session = new Session();
    }

    private async loadNavBar() {
        let userType = await this.session.getUserType();
        let nav = new NavTemplate(userType);
        nav.load();
    }

    public load() {
        this.loadNavBar();
    }

}