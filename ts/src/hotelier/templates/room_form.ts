import FormTemplate from "../modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import { HotelModel, room_types } from "../modules/interfaces.js";
import utilities from "../../settings/modules/utilities.js";

export default class RoomFormTemplate extends FormTemplate {

    constructor(protected typeForm: string) {
        super(urls_api.roomType,
            {redirectURL: "reload", removalRedirectURL: urls_front.room_list, showMessage: true},
            typeForm,
        );
    }

    protected formTemplate(): string {
        let buttonName: string = this.typeForm == "register" ? "Agregar habitación" : "Editar habitación";

        return this.createForm("Tipo de habitación", buttonName, [
            { type: { typeElement: "select" }, nameId: "Hotel", nameLabel: "Hotel", nameSelect: "Seleccione un hotel", cls: "col-md-6" },
            { type: { typeElement: "input", typeInput: "text" }, nameId: "Type", nameLabel: "Tipo de habitación", cls: "col-md-6" },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Capacity", nameLabel: "Capacidad", cls: "col-md-4", attributes: { min: 1 } },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Price", nameLabel: "Precio", cls: "col-md-4", attributes: { min: 0.5, step: 0.01 } },
            { type: { typeElement: "input", typeInput: "number" }, nameId: "Rooms", nameLabel: "Cantidad de habitaciones", cls: "col-md-4", attributes: { min: 1 } },
            { type: { typeElement: "textarea" }, nameId: "Description", nameLabel: "Descripción", cls: "col-12", attributes: { rows: 5 } }
        ]);
    }

    protected rederForm(): void {
        super.rederForm();

        // Renderizar los hoteles en el selector
        utilities.renderSelector(urls_api.hotels, "inputHotel", (hotel: HotelModel) => {
            return { value: hotel.id, textContent: `${hotel.name} - ${hotel.city}` };
        });
    }

    protected async getFormAttributes() {
        try {
            const hotel = <string>this.validateField("inputHotel", "inputHotelFeedback", { typeElement: "select", required: true });
            const type = <string>this.validateField("inputType", "inputTypeFeedback", { typeElement: "text", required: true, max_length: 50 });
            const capacity = <number>this.validateField("inputCapacity", "inputCapacityFeedback", { typeElement: "number", required: true, min_length: 1, max_length: 50, isInteger: true });
            const price = <number>this.validateField("inputPrice", "inputPriceFeedback", { typeElement: "number", required: true, min_length: 0.1, max_length: 999999.99 });
            const rooms = <number>this.validateField("inputRooms", "inputRoomsFeedback", { typeElement: "number", required: true, min_length: 1, isInteger: true });
            const description = <string>this.validateField("inputDescription", "inputDescriptionFeedback", { typeElement: "text", required: true, max_length: 2000 });

            return { hotel, type, capacity, price, rooms, description };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let hotel = <HTMLSelectElement>document.getElementById("inputHotel");
        let type = <HTMLInputElement>document.getElementById("inputType");
        let capacity = <HTMLInputElement>document.getElementById("inputCapacity");
        let price = <HTMLInputElement>document.getElementById("inputPrice");
        let rooms = <HTMLInputElement>document.getElementById("inputRooms");
        let description = <HTMLInputElement>document.getElementById("inputDescription");

        return { hotel, type, capacity, price, rooms, description };
    }

    protected fillFields(roomType: room_types): void {
        let formElements = this.getFormElements();

        // Llenar el selector
        setTimeout(() => {
            formElements.hotel.value = roomType.hotel;
        }, 100);

        // Llenar los demas inputs
        formElements.type.value = roomType.type;
        formElements.capacity.value = roomType.capacity.toString();
        formElements.price.value = roomType.price;
        formElements.rooms.value = roomType.rooms.toString();
        if (roomType.description) formElements.description.value = roomType.description;
    }
}