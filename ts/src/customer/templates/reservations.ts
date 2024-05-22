import { urls_api, urls_front } from "../../settings/urls.js";
import utilities from "../../settings/modules/utilities.js";
import request from "../../settings/modules/request.js";

export default class Reservations {
    main: HTMLElement | null;

    constructor() {
        this.main = document.getElementById("main");
    }

    private renderTemplate() {
        if (!this.main) throw new Error("'main' not found.");
        this.main.classList.add("main--detail");
        this.main.innerHTML = [
            '<div class="cont reservation">',
            '   <div id="liveAlertPlaceholder" style="witdh: 100%"></div>',
            '   <h1 class="text-center title-1">Reservaciones</h1>',
            '   <div class="reservationStatus" style="display: flex; align-items: center; gap: 1em; align-self: flex-start;">',
            '       <label for="reservationStatus" class="form-label">Estado:</label>',
            '       <select class="form-select" title="Estado" id="reservationStatus">',
            '           <option value="RE">Activo</option>',
            '           <option value="EX">Expirado</option>',
            '           <option value="FA">Fallido</option>',
            '       </select>',
            '   </div>',
            '   <div class="rsv__container" id="reservationContainer"></div>',
            '   <nav aria-label="Page navigation example" class="section__pagination rsv__nav">',
            '       <ul class="pagination" id="paginationContainer"></ul>',
            '   </nav>',
            '</div>'
        ].join("");
    }

    protected renderReservations(reservations: any, page: string | undefined, status: string) {
        const reservationContainer = <HTMLDivElement>document.getElementById("reservationContainer");
        let reservationList: string[] = [];
        reservations.results.forEach((reservation: any) => {
            let statusColor = reservation.status == "RE" ? "#070" : reservation.status == "EX" ? "#ffc107" : "#dc3545";

            let bedrooms: string[] = [];
            for (let room of reservation.bedrooms) {
                bedrooms.push(
                    `<tr><td><strong>${room?.room_type?.type ?? "No disponible"}</strong></td><td>${room.rooms}</td></tr>`
                );
            }

            reservationList.push([
                '<details name="reservations">',
                '   <summary class="rsv__item">',
                `       <img class="rsv__img" src="${reservation.hotel?.image}" alt="${reservation.hotel?.name ?? "No disponible"}">`,
                '       <div class="rsv__body">',
                `           <div class="rsv__status" style="color: ${statusColor};">${reservation.status}</div>`,
                `           <div class="rsv__title">${reservation.hotel?.name ?? "No disponible"}</div>`,
                '           <div class="rsv__check">',
                `               <div>Fecha de entrada: <span>${reservation.checkin}</span></div>`,
                `               <div>Fecha de salida: <span>${reservation.checkout}</span></div>`,
                '           </div>',
                `           <div class="rsv__amount">$${reservation.amount ?? "0"} MXN</div>`,
                `           <div class="rsv__date">${reservation.create_at}</div>`,
                '       </div>',
                '   </summary>',
                '   <div class="table-responsive" style="width: 100%; margin: -1.2em 0;">',
                '       <table class="table align-middle table-bordered table__rooms">',
                '           <thead class="table-primary">',
                '               <tr>',
                '                   <th>Tipo de habitación</th>',
                '                   <th>Habitaciones reservadas</th>',
                '               </tr>',
                '           </thead>',
                '           <tbody>',
                `               ${bedrooms.join("")}`,
                '           </tbody>',
                '       </table>',
                '   </div>',
                '</details>'
            ].join(""));
        });

        // Insertar elementos
        reservationContainer.innerHTML = reservationList.join("");

        // Renderizar el paginador
        utilities.createPagination(
            urls_front.reservations,
            reservations.count,
            reservations.next,
            page,
            reservations.previous,
            `&status=${status}`
        );
    }

    private getReservations(status: string = "RE", page?: string) {
        let pageParam = page ? `&page=${page}` : "";
        const response = request.serverRequest(`${urls_api.reservations}?status=${status}${pageParam}`, "GET");
        response.then((data: Response) => {
            if (!data.ok) throw new Error(data.statusText);//Pendiente
            return data.json();
        }).then((reservations) => this.renderReservations(reservations, page, status));
    }

    private loadReservations() {
        // Obtener mensaje del checkout
        let message = new URLSearchParams(location.search).get("message");
        if (message) utilities.createAlert(message, "success");

        // Obtener reservaciones
        let status = new URLSearchParams(location.search).get("status");
        let page = new URLSearchParams(location.search).get("page");

        if (status && page && !isNaN(Number.parseInt(page))) {
            this.getReservations(status, page);
        } else this.getReservations();
    }

    private handleSelectorEvents() {
        const selectorStatus = <HTMLSelectElement>document.getElementById("reservationStatus");
        selectorStatus.addEventListener("change", () => {
            this.getReservations(selectorStatus.value);
        });
    }

    public load() {
        this.renderTemplate();
        this.loadReservations();
        this.handleSelectorEvents();
    }
}