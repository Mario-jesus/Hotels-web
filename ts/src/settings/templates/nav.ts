import Session from "../modules/session.js";
import { urls_front } from "../urls.js";
import { generate_dashboard_stripe_link, generate_account_link } from "../../hotelier/templates/express.js";

export default class NavTemplate {
    private header: HTMLElement | null;
    private session: Session;

    constructor(protected userType: string) {
        this.session = new Session();
        this.header = document.getElementById("header");
    }

    private async generateNavItems(): Promise<string> {
        let items: string;
        switch (this.userType) {
            case "Hotelier":

                items = [
                    '<li class="nav-item">',
                    `   <a class="nav-link active" aria-current="page" href="${urls_front.home}">Inicio</a>`,
                    '</li>',
                    '<li class="nav-item dropdown">',
                    '   <a class="nav-link active dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false">',
                    '       Hoteles',
                    '   </a>',
                    '   <ul class="dropdown-menu">',
                    `       <li><a class="dropdown-item" href="${urls_front.hotel_register}">Registrar hotel</a></li>`,
                    `       <li><a class="dropdown-item" href="${urls_front.hotel_list}">Listar hoteles</a></li>`,
                    '   </ul>',
                    '</li>',
                    '<li class="nav-item dropdown">',
                    '   <a class="nav-link active dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false">',
                    '      Gestionar',
                    '   </a>',
                    '   <ul class="dropdown-menu">',
                    `       <li><a class="dropdown-item" href="${urls_front.room_register}">Registrar habitación</a></li>`,
                    `       <li><a class="dropdown-item" href="${urls_front.room_list}">Listar habitaciones</a></li>`,
                    '       <li><hr class="dropdown-divider"></li>',
                    `       <li><a class="dropdown-item" href="${urls_front.service_register}">Agregar servicios</a></li>`,
                    `       <li><a class="dropdown-item" href="${urls_front.service_list}">Listar servicios</a></li>`,
                    '       <li><hr class="dropdown-divider"></li>',
                    `       <li><a class="dropdown-item" href="${urls_front.image_register}">Agregar imagenes</a></li>`,
                    `       <li><a class="dropdown-item" href="${urls_front.image_list}">Listar imagenes</a></li>`,
                    '   </ul>',
                    '</li>',
                    '<li class="nav-item">',
                    '   <a class="nav-link active" aria-current="page" href="#" target="_blank" id="navExpress">Stripe Express</a>',
                    '</li>',
                    '<li class="nav-item dropdown">',
                    '   <a class="nav-link active dropdown-toggle" href="" role="button" data-bs-toggle="dropdown" aria-expanded="false">',
                    '       Cuenta',
                    '   </a>',
                    '   <ul class="dropdown-menu">',
                    '       <li><a class="dropdown-item" href="#" target="_blank" id="navExpressAccount">Cuenta de express</a></li>',
                    '       <li><a class="dropdown-item" href=""><button id="logOut">Cerrar sessión</button></a></li>',
                    '   </ul>',
                    '</li>'
                ].join("");
                break;

            case "Customer":
                items = [
                    '<li class="nav-item">',
                    `   <a class="nav-link active" aria-current="page" href="${urls_front.home}">Inicio</a>`,
                    '</li>',
                    '<li class="nav-item">',
                    `   <a class="nav-link active" aria-current="page" href="${urls_front.reservations}">Reservas</a>`,
                    '</li>',
                    '<li class="nav-item active dropdown">',
                    '   <a class="nav-link active dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">',
                    '       Cuenta',
                    '   </a>',
                    '   <ul class="dropdown-menu">',
                    '       <li><a class="dropdown-item" href=""><button id="logOut">Cerrar sessión</button></a></li>',
                    '   </ul>',
                    '</li>'
                ].join("");
                break;

            default:
                items = [
                    '<li class="nav-item">',
                    `   <a class="nav-link active" aria-current="page" href="${urls_front.home}">Inicio</a>`,
                    '</li>',
                    '<li class="nav-item active dropdown">',
                    '   <a class="nav-link active dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">',
                    '       Cuenta',
                    '   </a>',
                    '   <ul class="dropdown-menu">',
                    `       <li><a class="dropdown-item" href="${urls_front.login}">Iniciar sesión</a></li>`,
                    `       <li><a class="dropdown-item" href="${urls_front.signup}">Registrarse</a></li>`,
                    '   </ul>',
                    '</li>'
                ].join("");
                break;
        }

        return items;
    }

    // Renderisar barra de navegacion
    private async renderNavbar(): Promise<void> {
        let navItems = await this.generateNavItems();
        

        let nav = [
            '<nav class="navbar navbar-expand-lg bg-body-tertiary" id="navbar">',
            '   <div class="container-fluid">',
            `       <a class="navbar-brand" href="${urls_front.home}">Hotels</a>`,
            '       <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll" aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">',
            '           <span class="navbar-toggler-icon"></span>',
            '       </button>',
            '       <div class="collapse navbar-collapse" id="navbarScroll">',
            '           <ul id="nav__container" class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style="--bs-scroll-height: 100px;">',
            `               ${navItems}`,
            '           </ul>',
            '           <div id="searchContainer">',
            '               <!-- <form class="d-flex" role="search">',
            '                   <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">',
            '                   <button class="btn btn-outline-success" type="submit">Search</button>',
            '               </form> -->',
            '           </div>',
            '       </div>',
            '   </div>',
            '</nav>'
        ].join("");

        if (this.header) {
            this.header.innerHTML += nav;
        } else {
            console.error("No se ha encontrado el elemento 'header' para agregar la barra de navegación.");
        }

        this.addEventsListener();
        this.loadNavbarData();
    }

    private addEventsListener() {
        //  Escuchar eventos del logout si el usuario esta autenticado
        if (this.userType == "Hotelier" || this.userType == "Customer") {
            let logOut = <HTMLElement>document.getElementById('logOut');
            logOut.addEventListener('click', () => {
                this.session.destroySession();
            });
        }
    }

    private async loadNavbarData(): Promise<void> {
        switch (this.userType) {
            case "Hotelier":
                try {
                    // Load express account
                    let account_link = await generate_account_link();
                    if (typeof account_link !== "string") throw new Error("Ah ocurrido un error al intentar acceder a la cuenta de stripe.");
                    let navExpressAccount = <HTMLLinkElement>document.getElementById("navExpressAccount");
                    navExpressAccount.href = account_link;

                    // Load express dashboard
                    let dashboard_stripe_link = await generate_dashboard_stripe_link();
                    if (typeof dashboard_stripe_link !== "string") throw new Error("Ah ocurrido un error al intentar acceder al panel de express.");
                    let navExpress = <HTMLLinkElement>document.getElementById("navExpress");
                    navExpress.href = dashboard_stripe_link;
                }
                catch (error) {
                    console.error(error);
                }
                break;

            case "Customer":
                break;

            default:
                break;
        }
    }

    public load() {
        this.renderNavbar();
    }
}