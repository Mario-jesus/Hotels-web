import HotelListTemplate from "./templates/hotel_list.js";
import HotelFormTemplate from "./templates/hotel_form.js";
import RoomListTemplate from "./templates/room_list.js";
import RoomFormTemplate from "./templates/room_form.js";
import ServiceListTemplate from "./templates/service_list.js";
import ServicesFormTemplate from "./templates/service_form.js";
import ImageListTemplate from "./templates/image_list.js";
import ImageFormTemplate from "./templates/image_form.js";

export default class AppHotelier {
    template: string | null;
    hotelListTemplate: HotelListTemplate;
    hotelRegisterTemplate: HotelFormTemplate;
    hotelEditTemplate: HotelFormTemplate;
    roomListTemplate: RoomListTemplate;
    roomRegisterTemplate: RoomFormTemplate;
    roomEditTemplate: RoomFormTemplate;
    serviceListTemplate: ServiceListTemplate;
    serviceRegisterTemplate: ServicesFormTemplate;
    serviceEditTemplate: ServicesFormTemplate;
    imageListTemplate: ImageListTemplate;
    imageRegisterTempalte: ImageFormTemplate;
    imageEditTemplate: ImageFormTemplate;

    constructor() {
        this.template = new URLSearchParams(location.search).get("template");
        this.hotelListTemplate = new HotelListTemplate();
        this.hotelRegisterTemplate = new HotelFormTemplate("register");
        this.hotelEditTemplate = new HotelFormTemplate("edit");
        this.roomListTemplate = new RoomListTemplate();
        this.roomRegisterTemplate = new RoomFormTemplate("register");
        this.roomEditTemplate = new RoomFormTemplate("edit");
        this.serviceListTemplate = new ServiceListTemplate();
        this.serviceRegisterTemplate = new ServicesFormTemplate("register");
        this.serviceEditTemplate = new ServicesFormTemplate("edit");
        this.imageListTemplate = new ImageListTemplate();
        this.imageRegisterTempalte = new ImageFormTemplate("register");
        this.imageEditTemplate = new ImageFormTemplate("edit");
    }

    private loadPage(): void {
        switch (this.template) {
            case "hotel_list":
                this.hotelListTemplate.load();
                break;

            case "hotel_register":
                this.hotelRegisterTemplate.load();
                break;

            case "hotel_edit":
                this.hotelEditTemplate.load();
                break;

            case "room_list":
                this.roomListTemplate.load();
                break;

            case "room_register":
                this.roomRegisterTemplate.load();
                break;

            case "room_edit":
                this.roomEditTemplate.load();
                break;

            case "service_list":
                this.serviceListTemplate.load();
                break;

            case "service_register":
                this.serviceRegisterTemplate.load();
                break;

            case "service_edit":
                this.serviceEditTemplate.load();
                break;

            case "image_list":
                this.imageListTemplate.load();
                break;

            case "image_register":
                this.imageRegisterTempalte.load();
                break;

            case "image_edit":
                this.imageEditTemplate.load();
                break;

            default:
                break;
        }
    }

    public load(): void {
        this.loadPage();
    }
}