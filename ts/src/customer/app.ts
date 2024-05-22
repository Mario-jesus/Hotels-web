import Home from "./templates/home.js";
import Detail from "./templates/detail.js";
import Checkout from "./templates/checkout.js";
import Reservations from "./templates/reservations.js";

export default class AppCustomer {
    template: string | null;
    home: Home;
    detail: Detail;
    reservations: Reservations;

    constructor() {
        this.template = new URLSearchParams(location.search).get("template");
        this.home = new Home();
        this.detail = new Detail();
        this.reservations = new Reservations();
    }

    private loadPage(): void {
        switch (this.template) {
            case "detail":
                this.detail.load();
                break;

            case "checkout":
                const checkout = new Checkout();
                checkout.load();
                break;

            case "reservations":
                this.reservations.load();
                break;

            default:
                this.home.load();
                break;
        }
    }

    public load(): void {
        this.loadPage();
    }
}