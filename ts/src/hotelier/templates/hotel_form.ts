import FormTemplate from "../modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import { HotelModel } from "../modules/interfaces.js";

export default class HotelFormTemplate extends FormTemplate {

    // typeForm => "register" | "edit"
    constructor(protected typeForm: string) {
        super(
            urls_api.hotels,
            {redirectURL: "reload", removalRedirectURL: urls_front.hotel_list, showMessage: true},
            typeForm,
        );
    }

    protected formTemplate(): string {
        let buttonName: string = this.typeForm == "register" ? "Agregar hotel" : "Editar hotel";

        return this.createForm("Hotel", buttonName, [
            { type: { typeElement: "input", typeInput: "text" }, nameId: "Name", nameLabel: "Nombre del hotel", cls: "col-md-6" },
            { type: { typeElement: "input", typeInput: "tel" }, nameId: "Phone", nameLabel: "Teléfono", cls: "col-md-6" },
            { type: { typeElement: "textarea" }, nameId: "Address", nameLabel: "Dirección", cls: "col-12", attributes: { rows: 2 } },
            { type: { typeElement: "textarea" }, nameId: "Description", nameLabel: "Descripción", cls: "col-12", attributes: { rows: 5 } },
            { type: {typeElement: "input", typeInput: "text"}, nameId: "City", nameLabel: "Ciudad", cls: "col-md-6" },
            { type: {typeElement: "input", typeInput: "text"}, nameId: "State", nameLabel: "Estado", cls: "col-md-4" },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Rating", nameLabel: "Calificación", cls: "col-md-2", attributes: { min: 1, max: 5 } },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Latitude", nameLabel: "Latitud", cls: "col-md-6", attributes: { step: 0.000001, min: -90, max: 90 } },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Longitude", nameLabel: "Longitud", cls: "col-md-6", attributes: { step: 0.000001, min: -180, max: 180 } }
        ]);
    }

    protected async getFormAttributes() {
        try {
            const name = <string>this.validateField("inputName", "inputNameFeedback", { typeElement: "text", required: true, max_length: 100 });
            const description = <string>this.validateField("inputDescription", "inputDescriptionFeedback", { typeElement: "text", required: true, max_length: 5000 });
            const phone = <string>this.validateField("inputPhone", "inputPhoneFeedback", { typeElement: "text", required: true, max_length: 15 });
            const address = <string>this.validateField("inputAddress", "inputAddressFeedback", { typeElement: "text", required: true, max_length: 1000 });
            const city = <string>this.validateField("inputCity", "inputCityFeedback", { typeElement: "text", required: true, max_length: 50 });
            const state = <string>this.validateField("inputState", "inputStateFeedback", { typeElement: "text", required: true, max_length: 50 });
            const rating = <number>this.validateField("inputRating", "inputRatingFeedback", { typeElement: "number", required: true, min_length: 1, max_length: 5, isInteger: true });
            const latitude = <number>this.validateField("inputLatitude", "inputLatitudeFeedback", { typeElement: "number", required: true, min_length: -90, max_length: 90 });
            const longitude = <number>this.validateField("inputLongitude", "inputLongitudeFeedback", { typeElement: "number", required: true, min_length: -180, max_length: 180 });

            return {
                name, description, phone, address, city, state, rating,
                coordinates: { latitude, longitude }
            };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let name = <HTMLInputElement>document.getElementById("inputName");
        let phone = <HTMLInputElement>document.getElementById("inputPhone");
        let address = <HTMLTextAreaElement>document.getElementById("inputAddress");
        let description = <HTMLTextAreaElement>document.getElementById("inputDescription");
        let city = <HTMLInputElement>document.getElementById("inputCity");
        let state = <HTMLInputElement>document.getElementById("inputState");
        let rating = <HTMLInputElement>document.getElementById("inputRating");
        let latitude = <HTMLInputElement>document.getElementById("inputLatitude");
        let longitude = <HTMLInputElement>document.getElementById("inputLongitude");

        return { name, phone, address, description, city, state, rating, latitude, longitude };
    }

    protected fillFields(hotel: HotelModel): void {
        let formElements = this.getFormElements();
        formElements.name.value = hotel.name;
        formElements.phone.value = hotel.phone;
        formElements.address.value = hotel.address;
        formElements.description.value = hotel.description;
        formElements.city.value = hotel.city;
        formElements.state.value = hotel.state;
        formElements.rating.value = hotel.rating.toString();
        formElements.latitude.value = hotel.coordinates.latitude;
        formElements.longitude.value = hotel.coordinates.longitude;
    }
}