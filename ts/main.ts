import AppSettings  from "./src/settings/app.js";
import AppAccount from "./src/account/app.js";
import AppHotelier from "./src/hotelier/app.js";
import AppCustomer from "./src/customer/app.js";
import Session from "./src/settings/modules/session.js";

addEventListener("DOMContentLoaded", main);

function main(): void {
    let main = new Main();
    main.load();
}

class Main {
    session: Session;

    constructor() {
        // Crear los contenedores padres
        this.createParentElements();

        // Ejecutar la app principal que tambien contiene la barra de navegación
        let appSettings = new AppSettings();
        appSettings.load();

        // Declarar otros atributos
        this.session = new Session();
    }

    private createParentElements(): void {
        let header: HTMLElement = document.createElement("header");
        let main: HTMLElement = document.createElement("main");
        header.setAttribute("id", "header");
        main.setAttribute("id", "main");
        document.body.appendChild(header);
        document.body.appendChild(main);
    }

    private async setInterfaceForUserType() {
        let userType: string = await this.session.getUserType();

        switch (userType) {
            case "Hotelier":
                let appHotelier = new AppHotelier();
                appHotelier.load();
                break;

            case "Customer":
                let appCustomer = new AppCustomer();
                appCustomer.load();
                break;

            default:
                let appAccount = new AppAccount();
                appAccount.load();
                break;
        }
    }

    public load(): void {
        this.setInterfaceForUserType();
    }
}
