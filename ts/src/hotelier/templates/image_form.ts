import FormTemplate from "../modules/form_template.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import { HotelModel, images, imageCategory } from "../modules/interfaces.js";
import utilities from "../../settings/modules/utilities.js";

export default class ImageFormTemplate extends FormTemplate {

    constructor(protected typeForm: string) {
        super(
            urls_api.hotelImages,
            {redirectURL: "reload", removalRedirectURL: urls_front.image_list, showMessage: true},
            typeForm,
        );
    }

    protected formTemplate(): string {
        let buttonName: string = this.typeForm == "register" ? "Agregar imagen" : "Editar imagen";

        return this.createForm("Imagen", buttonName, [
            { type: { typeElement: "select" }, nameId: "Hotel", nameLabel: "Hotel", nameSelect: "Seleccione un hotel", cls: "col-md-6" },
            { type: { typeElement: "select" }, nameId: "Category", nameLabel: "Categoría",  nameSelect: "Seleccione una categoría de imagen", cls: "col-md-6" },
            { type: { typeElement: "input", typeInput: "file" }, nameId: "Image", nameLabel: "Imagen", cls: "col-md-12", attributes: { accept: "image/*" } },
            { type: { typeElement: "textarea" }, nameId: "Description", nameLabel: "Descripción", cls: "col-12", attributes: { rows: 5 } }
        ]);
    }

    protected rederForm(): void {
        super.rederForm();

        // Renderizar los hoteles en el selector
        utilities.renderSelector(urls_api.hotels, "inputHotel", (hotel: HotelModel) => {
            return { value: hotel.id, textContent: `${hotel.name} - ${hotel.city}` };
        });

        // Renderizar los servicios en el selector
        utilities.renderSelector(urls_api.imageCategories, "inputCategory", (imageCategory: imageCategory) => {
            return { value: imageCategory.id, textContent: imageCategory.name };
        });
    }

    protected async getFormAttributes() {
        try {
            const hotel = <string>this.validateField("inputHotel", "inputHotelFeedback", { typeElement: "select", required: true });
            const category = <string>this.validateField("inputCategory", "inputCategoryFeedback", { typeElement: "select", required: true, isInteger: true });
            const imageFile = this.validateField("inputImage", "inputImageFeedback", { typeElement: "file", required: true, max_length: 20_971_520 });
            const description = <string>this.validateField("inputDescription", "inputDescriptionFeedback", { typeElement: "text", required: false, max_length: 2000 });

            const image = await utilities.fileToBase64(imageFile);

            return { hotel, category, image, description };

        } catch(error) {
            throw new Error(`Error: ${error}`);
        }
    }

    private getFormElements() {
        let hotel = <HTMLSelectElement>document.getElementById("inputHotel");
        let category = <HTMLInputElement>document.getElementById("inputCategory");
        let image = <HTMLInputElement>document.getElementById("inputImage");
        let description = <HTMLInputElement>document.getElementById("inputDescription");

        return { hotel, category, image, description };
    }

    protected fillFields(service: images): void {
        let formElements = this.getFormElements();

        // Llenar los selectores
        setTimeout(() => {
            formElements.hotel.value = service.hotel;
            formElements.category.value = service.category.toString();
        }, 100);

        // Llenar los demas inputs
        if (service.description) formElements.description.value = service.description;
    }
}