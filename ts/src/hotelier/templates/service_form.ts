import FormTemplate from "../modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import { HotelModel, services, servicesHotel } from "../modules/interfaces.js";
import utilities from "../../settings/modules/utilities.js";

export default class ServicesFormTemplate extends FormTemplate {

    constructor(protected typeForm: string) {
        super(
            urls_api.hotelServices,
            {redirectURL: "reload", removalRedirectURL: urls_front.service_list, showMessage: true},
            typeForm,
        );
    }

    protected formTemplate(): string {
        let buttonName: string = this.typeForm == "register" ? "Agregar Servicio" : "Editar Servicio";

        return this.createForm("Servicio", buttonName, [
            { type: { typeElement: "select" }, nameId: "Hotel", nameLabel: "Hotel", nameSelect: "Seleccione un hotel", cls: "col-md-5" },
            { type: { typeElement: "select" }, nameId: "Service", nameLabel: "Servicios",  nameSelect: "Seleccione un servicio", cls: "col-md-5" },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Price", nameLabel: "Precio", cls: "col-md-2", attributes: { min: 0.5, step: 0.01 } },
            { type: { typeElement: "textarea" }, nameId: "Description", nameLabel: "Descripción", cls: "col-12", attributes: { rows: 5 } }
        ]);
    }

    protected rederForm(): void {
        super.rederForm();

        // Renderizar los hoteles en el selector
        utilities.renderSelector(urls_api.all_hotels, "inputHotel", (hotel: HotelModel) => {
            return { value: hotel.id, textContent: `${hotel.name} - ${hotel.city}` };
        });

        // Renderizar los servicios en el selector
        utilities.renderSelector(urls_api.services, "inputService", (service: services) => {
            return { value: service.id, textContent: service.name };
        });
    }

    protected async getFormAttributes() {
        try {
            const hotel = <string>this.validateField("inputHotel", "inputHotelFeedback", { typeElement: "select", required: true });
            const service = <string>this.validateField("inputService", "inputServiceFeedback", { typeElement: "select", required: true, isInteger: true });
            const price = <number>this.validateField("inputPrice", "inputPriceFeedback", { typeElement: "number", required: false, min_length: 0.1, max_length: 999999.99 });
            const description = <string>this.validateField("inputDescription", "inputDescriptionFeedback", { typeElement: "text", required: false, max_length: 2000 });

            return { hotel, service, price, description };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let hotel = <HTMLSelectElement>document.getElementById("inputHotel");
        let service = <HTMLSelectElement>document.getElementById("inputService");
        let price = <HTMLInputElement>document.getElementById("inputPrice");
        let description = <HTMLInputElement>document.getElementById("inputDescription");

        return { hotel, service, price, description };
    }

    protected fillFields(service: servicesHotel): void {
        let formElements = this.getFormElements();

        // Llenar los selectores
        setTimeout(() => {
            formElements.hotel.value = service.hotel;
            formElements.service.value = service.service.toString();
        }, 100);

        // Llenar los demas inputs
        if (service.price) formElements.price.value = service.price;
        if (service.description) formElements.description.value = service.description;
    }
}