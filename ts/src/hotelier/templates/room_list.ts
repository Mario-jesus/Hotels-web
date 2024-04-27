import { urls_front } from "../../settings/urls.js";
import ListTemplate from "../modules/list_template.js";
import { HotelModel } from "../modules/interfaces.js";

export default class RoomListTemplate extends ListTemplate {

    constructor() {
        super("Tipos de habitaciones", true);
    }

    protected itemTemplate(item: HotelModel): string {
        let html: string = "";
        let room_types = item.room_types;
        if (!room_types) return html;
        room_types.forEach(roomtype => {
            html += [
                '<div class="card mx-2 mb-3" style="width: 18rem;">',
                '   <div class="card-body">',
                `       <h5 class="card-title">${roomtype.type}</h5>`,
                `       <p class="card-text">${roomtype.description?.substring(0,100)}</p>`,
                `       <a href="${urls_front.room_edit}&id=${roomtype.id}" class="btn btn-outline-secondary">Actualizar</a>`,
                '   </div>',
                '</div>'
            ].join("\n");
        });

        return html;
    }
}