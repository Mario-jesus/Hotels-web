import { urls_api, urls_front, STRIPE_PUBLIC_KEY } from "../../settings/urls.js";
import request from "../../settings/modules/request.js";
import utilities from "../../settings/modules/utilities.js";

export default class Checkout {
    main: HTMLElement | null;
    stripe: any;
    elements: any;

    constructor() {
        this.main = document.getElementById("main");
        // @ts-ignore
        this.stripe = Stripe(STRIPE_PUBLIC_KEY);
    }

    private renderTemplate() {
        if (!this.main) throw new Error("'main' not found.");
        this.main.innerHTML = [
            '<div class="cont">',
            '   <div id="liveAlertPlaceholder"></div>',
            '   <h4 class="title-1" style="text-align: center;">Pagar</h4>',
            '   <form id="payment-form" class="formCheckout row g-3 needs-validation" action="">',
            '       <div id="payment-element">',
            '           <!--Stripe.js injects the Payment Element-->',
            '       </div>',
            '       <button id="submit" class="button" type="submit">',
            '           <div class="spinner hidden" id="spinner"></div>',
            '           <span id="button-text">Pay now</span>',
            '       </button>',
            '   </form>',
            '</div>'
        ].join("");
    }

    private async getClientSecret(): Promise<string> {
        // Obtener los datos de compra del cliente
        let reservationData = JSON.parse(sessionStorage.getItem("reservationData") ?? "{}");
        // Realizar la petición de compra
        const response = await request.serverRequest(urls_api.reservationWithNewCard, "POST", reservationData);

        const data = await response.json();

        if (!response.ok) {
            utilities.createAlert("Ha ocurrido un error al intentar realizar el pago.", "danger");
            console.error(data);
            throw new Error(response.statusText);
        }

        return data.clientSecret;
    }

    private async initialize() {
        let clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) clientSecret = await this.getClientSecret();

        const appearance = {
            theme: 'stripe',
        };
        this.elements = this.stripe.elements({ appearance, clientSecret });

        const paymentElementOptions = {
            layout: "tabs",
        };

        const paymentElement = this.elements.create("payment", paymentElementOptions);
        paymentElement.mount("#payment-element");
    }

    private addEventForm() {
        const form = <HTMLFormElement>document.getElementById("payment-form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            this.setLoading(true);

            const { error } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: urls_front.checkout,
                },
            });

            if (error.type === "card_error" || error.type === "validation_error") {
                utilities.createAlert(error.message, "danger");
            } else {
                utilities.createAlert("An unexpected error occurred.", "danger");
            }

            this.setLoading(false);
        });
    }

    private async checkStatus(): Promise<void> {
        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
        if (!clientSecret) return;

        const { paymentIntent } = await this.stripe.retrievePaymentIntent(clientSecret);

        switch (paymentIntent.status) {
            case "succeeded":
                sessionStorage.removeItem("reservationData");
                location.href = `${urls_front.reservations}&message=${encodeURIComponent("¡Su pago ha sido completado!")}`;
                break;

            case "processing":
                utilities.createAlert("Su pago esta siendo procesado.", "info");
                break;

            case "requires_payment_method":
                utilities.createAlert("Su pago no pudo ser completado, por favor intentelo de nuevo.", "danger");
                break;

            default:
                utilities.createAlert("Algo salió mal.", "danger");
                break;
        }
    }

    private setLoading(isLoading: boolean) {
        let submit = <HTMLButtonElement>document.getElementById("submit");
        let spinner = <HTMLDivElement>document.getElementById("spinner");
        let buttonText = <HTMLSpanElement>document.getElementById("button-text");

        if (isLoading) {
            // Disable the button and show a spinner
            submit.disabled = true;
            spinner.classList.remove("hidden");
            buttonText.classList.add("hidden");
        } else {
            submit.disabled = false;
            spinner.classList.add("hidden");
            buttonText.classList.remove("hidden");
        }
    }

    public async load(): Promise<void> {
        this.renderTemplate();
        await this.checkStatus();
        await this.initialize();
        this.addEventForm();
    }
}