import Reservations from "../../customer/templates/reservations.js";
import utilities from "../../settings/modules/utilities.js";
import { urls_front } from "../../settings/urls.js";

export default class Home extends Reservations {

    constructor() {
        super();
    }

    private hotelReservations(reservations: any[]): any {
        let hotelReservations: any = {};
        reservations.forEach((reservation) => {
            if (hotelReservations.hasOwnProperty(reservation.hotel.id)) {
                reservation.bedrooms.forEach((bedroom: any) => {
                    hotelReservations[reservation.hotel.id].bedrooms.push({
                        type: bedroom.room_type.type,
                        rooms: bedroom.rooms,
                        name: reservation.name,
                        email: reservation.email,
                        phone: reservation.phone,
                        checkin: reservation.checkin,
                        checkout: reservation.checkout
                    });
                });
            } else {
                let bedrooms: any[] = [];
                reservation.bedrooms.forEach((bedroom: any) => {
                    bedrooms.push({
                        type: bedroom.room_type.type,
                        rooms: bedroom.rooms,
                        name: reservation.name,
                        email: reservation.email,
                        phone: reservation.phone,
                        checkin: reservation.checkin,
                        checkout: reservation.checkout
                    });
                });
                hotelReservations[reservation.hotel.id] = {name: reservation.hotel.name, bedrooms: bedrooms};
            }
        });

        return hotelReservations;
    }

    protected renderReservations(reservations: any, page: string | undefined, status: string): void {
        const reservationContainer = <HTMLDivElement>document.getElementById("reservationContainer");
        let reservationList: string[] = [];

        const hotelReservations = this.hotelReservations(reservations.results);
        for (let hotelId in hotelReservations) {
            let bedrooms: string[] = [];
            hotelReservations[hotelId].bedrooms.forEach((bedroom: any) => {
                bedrooms.push([
                    '<tr>',
                    `   <td><strong>${bedroom.type}</strong></td>`,
                    `   <td>2</td>`,
                    `   <td style="white-space: nowrap;">${bedroom.name}</td>`,
                    `   <td style="white-space: nowrap;">${bedroom.email}</td>`,
                    `   <td style="white-space: nowrap;">${bedroom.phone}</td>`,
                    `   <td style="white-space: nowrap;">${bedroom.checkin}</td>`,
                    `   <td style="white-space: nowrap;">${bedroom.checkout}</td>`,
                    '</tr>',
                ].join(""));
            });

            reservationList.push([
                '<div class="table-responsive" style="width: 100%;">',
                '   <table class="table align-middle table-bordered caption-top table__rooms">',
                `       <caption>${hotelReservations[hotelId].name}</caption>`,
                '       <thead class="table-primary">',
                '           <tr>',
                '               <th>Tipo de habitación</th>',
                '               <th>Habitaciones reservadas</th>',
                '               <th>Nombre</th>',
                '               <th>Correo</th>',
                '               <th>Teléfono</th>',
                '               <th>Fecha de entrada</th>',
                '               <th>Fecha de salida</th>',
                '           </tr>',
                '       </thead>',
                '       <tbody>',
                `       ${bedrooms.join("")}`,
                '       </tbody>',
                '   </table>',
                '</div>',
            ].join(""));
        }

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
}