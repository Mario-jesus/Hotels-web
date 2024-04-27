import { urls_front } from "../../settings/urls.js";
import ListTemplate from "../modules/list_template.js";
import { HotelModel } from "../modules/interfaces.js";

export default class ImageListTemplate extends ListTemplate {

    constructor() {
        super("imagenes del hotel", true);
    }

    protected itemTemplate(item: HotelModel): string {
        let html: string = "";
        let images = item.images;
        if (!images) return html;
        images.forEach(image => {
            html += [
                '<div class="card mx-2 mb-3" style="width: 18rem;">',
                `   <img class="card-img-top" src="${image.image}" alt="${image.id}">`,
                '   <div class="card-body">',
                `       <h5 class="card-title">${image.category.name}</h5>`,
                `       <p class="card-text">${image.description?.substring(0,100)}</p>`,
                `       <a href="${urls_front.image_edit}&id=${image.id}" class="btn btn-outline-secondary">Actualizar</a>`,
                '   </div>',
                '</div>'
            ].join("\n");
        });

        return html;
    }
}