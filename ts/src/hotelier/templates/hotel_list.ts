import { urls_front } from "../../settings/urls.js";
import ListTemplate from "../modules/list_template.js";
import { HotelModel } from "../modules/interfaces.js";

export default class HotelListTemplate extends ListTemplate {

    constructor() {
        super("Hoteles")
    }

    protected itemTemplate(items: any): string {
        let html: string = "";
        items.results.forEach((hotel: HotelModel) => {
            html += [
                '<div class="card mx-2 mb-3" style="width: 18rem;">',
                `   <img src="${hotel.image}" class="card-img-top" alt="${hotel.name}">`,
                '   <div class="card-body">',
                `       <h5 class="card-title">${hotel.name}</h5>`,
                `       <p class="card-text card__description">${hotel.description}</p>`,
                `       <a href="${urls_front.hotel_edit}&id=${hotel.id}" class="btn btn-outline-secondary">Actualizar</a>`,
                '   </div>',
                '</div>'
            ].join("\n");
        });
        return html;
    }
}