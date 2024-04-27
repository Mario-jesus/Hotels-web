let host_api: string = "http://127.0.0.1:8000/api/v1/";
let host_front: string = "http://127.0.0.1:5500/";

export var urls_api = {
    user_detail: `${host_api}auth/user/`,
    login: `${host_api}auth/login/`,
    logout: `${host_api}auth/logout/`,
    signup: `${host_api}auth/signup/`,
    hotels: `${host_api}hotels/`,
    roomType: `${host_api}hotel_room-type/`,
    hotelServices: `${host_api}hotel_services/`,
    services: `${host_api}services/`,
    hotelImages: `${host_api}hotel_images/`,
    imageCategories: `${host_api}image-categories/`,
    dashboardStripeLink: `${host_api}generate_dashboard_stripe_link/`,
    accountLink: `${host_api}generate_account_link/`,
};

export var urls_front = {
    home: `${host_front}`,
    login: `${host_front}?template=login`,
    signup: `${host_front}?template=signup`,
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
};
