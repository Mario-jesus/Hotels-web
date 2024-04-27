import { urls_front } from "../../settings/urls.js";
import ListTemplate from "../modules/list_template.js";
import { HotelModel } from "../modules/interfaces.js";

export default class ServiceListTemplate extends ListTemplate {

    constructor() {
        super("Servicios del hotel", true);
    }

    protected itemTemplate(item: HotelModel): string {
        let html: string = "";
        let services = item.services;
        if (!services) return html;
        services.forEach(service => {
            html += [
                '<div class="card mx-2 mb-3" style="width: 18rem;">',
                '   <div class="card-body">',
                `       <h5 class="card-title">${service.service.name}</h5>`,
                `       <p class="card-text">${service.description?.substring(0,100)}</p>`,
                `       <a href="${urls_front.service_edit}&id=${service.id}" class="btn btn-outline-secondary">Actualizar</a>`,
                '   </div>',
                '</div>'
            ].join("\n");
        });

        return html;
    }
}