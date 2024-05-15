import request from "../../settings/modules/request.js";
import utilities from "../../settings/modules/utilities.js";
import { urls_api } from "../../settings/urls.js";

export default abstract class ListTemplate {
    private main: HTMLElement | null;

    constructor(protected title: string, protected activeHotelSelector: boolean = false) {
        this.main = document.getElementById("main");
    }

    protected renderContainer(): void {
        let list = [
            '<div class="container">',
            '   <div id="liveAlertPlaceholder" class="mt-3"></div>',
            `   <h3 class="my-3 text-center">${this.title}</h3>`,
            '   <div id="selectContainer"></div>',
            '   <div id="itemsContainer" class="d-flex flex-wrap justify-content-evenly align-content-around" style="min-height: 80vh;">',
            '   </div>',
            '</div>',
        ].join("\n");

        if (this.main) {
            this.main.innerHTML += list;
        } else {
            console.error("No se ha encontrado el elemento 'main' para agregar los artículos.");
        }
    }

    protected renderSelector(): void {
        let selectContainer = <HTMLDivElement|null>document.getElementById("selectContainer");
        if (!selectContainer) return;
        selectContainer.innerHTML = [
            '<select class="form-select" aria-label="Hotel select" id="selectHotel">',
            '   <option selected>Seleccione un hotel</option>',
            '</select>',
        ].join("\n");

        utilities.renderSelector(urls_api.hotels, "selectHotel", (hotel: any) => {
            return { value: hotel.id, textContent: `${hotel.name} - ${hotel.city}` };
        });

        let selectHotel = <HTMLSelectElement>document.getElementById("selectHotel");
        selectHotel.addEventListener("change", (e: any) => {
            if (e.target.selectedIndex !== 0) this.renderItems(`${urls_api.hotels}${e.target.value}/`);
        });
    }

    protected renderItems(url: string): void {
        let itemsContainer = document.getElementById("itemsContainer");
        let html: string = "";

        let response = request.serverRequest(url, "GET");
        response.then((data) => data.json()).then((items: any) => {
            html = this.itemTemplate(items);// items.results - despues de paginar hotels

            if (itemsContainer) {
                itemsContainer.innerHTML = html;
            } else {
                console.error("No se ha encontrado el contenedor para agregar los artículos.");
            }
        });
    }

    protected itemTemplate(item: any): string {
        return "";
    }

    public load(): void {
        this.renderContainer();

        // Si la vista de lista tiene un selector de hotel
        if (this.activeHotelSelector) {
            this.renderSelector();
        } else {
            this.renderItems(urls_api.hotels);
        }

        // Mostrar alertas
        utilities.showAlert();
    }
}