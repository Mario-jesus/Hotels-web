let host: string = "127.0.0.1";

let host_api: string = `http://${host}:8000/api/v1/`;
let host_front: string = `http://${host}:5500/`;

export var urls_api = {
    user_detail: `${host_api}auth/user/`,
    login: `${host_api}auth/login/`,
    logout: `${host_api}auth/logout/`,
    signup: `${host_api}auth/signup/`,
    hotels: `${host_api}hotels/`,
    all_hotels: `${host_api}all_hotels/`,
    roomType: `${host_api}hotel_room-type/`,
    hotelServices: `${host_api}hotel_services/`,
    services: `${host_api}services/`,
    hotelImages: `${host_api}hotel_images/`,
    imageCategories: `${host_api}image-categories/`,
    dashboardStripeLink: `${host_api}generate_dashboard_stripe_link/`,
    accountLink: `${host_api}generate_account_link/`,
    roomAvailability: `${host_api}room_availability/`,
    reservationWithNewCard: `${host_api}reservations/new_card/`,
    reservations : `${host_api}reservations/`,
};

export var urls_front = {
    home: `${host_front}`,
    login: `${host_front}?template=login`,
    signup: `${host_front}?template=signup`,
    // URLs del hotelero
    hotel_list: `${host_front}?template=hotel_list`,
    hotel_register: `${host_front}?template=hotel_register`,
    hotel_edit: `${host_front}?template=hotel_edit`,
    room_list: `${host_front}?template=room_list`,
    room_register: `${host_front}?template=room_register`,
    room_edit: `${host_front}?template=room_edit`,
    service_list: `${host_front}?template=service_list`,
    service_register: `${host_front}?template=service_register`,
    service_edit:`${host_front}?template=service_edit`,
    image_list: `${host_front}?template=image_list`,
    image_register: `${host_front}?template=image_register`,
    image_edit:`${host_front}?template=image_edit`,
    // URLs del cliente
    detail: `${host_front}?template=detail`,
    checkout: `${host_front}?template=checkout`,
    reservations: `${host_front}?template=reservations`,
};

export const STRIPE_PUBLIC_KEY: string = "pk_test_51Orj3ULMBegX0ayWa0iE8VjlSq4QwadhCmTUEWo43TWPOk6kznsx6bn5FFsDpfEDQRFXx7QmHQwpFrYAiyF8pkD600IC9DapHg";
