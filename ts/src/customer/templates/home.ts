import { urls_api, urls_front } from "../../settings/urls.js";
import request from "../../settings/modules/request.js";
import utilities from "../../settings/modules/utilities.js";
import Leaflet from "../modules/leaflet.js";

export default class Home {
    private main: HTMLElement | null;
    private header: HTMLElement | null;

    constructor() {
        this.main = document.getElementById("main");
        this.header = document.getElementById("header");
    }

    private renderCarrousel() {
        const carrouselContainer: HTMLDivElement = document.createElement("div");
        carrouselContainer.setAttribute("id", "carouselExampleSlidesOnly");
        carrouselContainer.setAttribute("class", "carousel slide carousel__container");
        carrouselContainer.setAttribute("data-bs-ride", "carousel");
        if (!this.header) throw new Error("Header not found.");
        this.header.appendChild(carrouselContainer);

        carrouselContainer.innerHTML = [
            '<div class="carousel-inner">',
            '   <div class="carousel-item active">',
            '       <img src="/imgs/ciudad-maderas-MXbM1NrRqtI-unsplash.jpg" class="d-block w-100 carousel__img" alt="ciudad-maderas">',
            '   </div>',
            '   <div class="carousel-item">',
            '       <img src="/imgs/valeriia-bugaiova-_pPHgeHz1uk-unsplash.jpg" class="d-block w-100 carousel__img" alt="valeriia-bugaiova">',
            '   </div>',
            '   <div class="carousel-item">',
            '       <img src="/imgs/sasha-kaunas-TAgGZWz6Qg8-unsplash.jpg" class="d-block w-100 carousel__img" alt="sasha-kaunas">',
            '   </div>',
            '</div>',
            '<div class="carousel__content">',
            '   <div class="carousel__body">',
            '       <h3>La perfección se encuentra en cada detalle, aquí y ahora.</h3>',
            '       <form role="search" id="formSearch">',
            '           <input class="input" type="search" placeholder="¿Cual es su destino?" aria-label="Search">',
            '           <button type="submit"><img src="/imgs/search.svg" alt="search"></button>',
            '       </form>',
            '       <p>Encuentra el hospedaje que buscas al mejor precio. . .</p>',
            '   </div>',
            '</div>',
            '<div style="height: 150px; overflow: hidden;" class="wave">',
            '   <svg viewBox="0 0 500 150" preserveAspectRatio="none" style="height: 100%; width: 100%;">',
            '       <path d="M-67.15,70.38 C136.00,232.22 358.92,41.77 548.53,144.39 L522.57,160.19 L0.00,150.00 Z" style="stroke: none; fill: #fff;"></path>',
            '   </svg>',
            '</div>'
        ].join("");
    }

    private rederMain() {
        if (!this.main) throw new Error("Main not found.");
        this.main.innerHTML = [
            '<section class="section section--info cont">',
            '   <div class="section__texts">',
            '       <h2 class="section__title">Reserva con Confianza: Tu Experiencia Perfecta Comienza Aquí.</h2>',
            '       <p class="section__paragraph">En nuestra plataforma, crear tu reserva es más fácil que nunca. Con un proceso rápido y seguro, puedes asegurar tu estancia con tan solo unos pocos clics. Además, nuestro equipo de hoteleros altamente capacitados está aquí para asistirte en cada paso del camino. Desde ayudarte a seleccionar la habitación perfecta que se adapte a tus necesidades y preferencias hasta proporcionarte información detallada sobre las comodidades disponibles, estamos comprometidos a hacer que tu experiencia de reserva sea lo más placentera y sin complicaciones posible. Tu comodidad y satisfacción son nuestra prioridad, y estamos aquí para asegurarnos de que tu estancia sea inolvidable desde el momento en que reservas con nosotros.</p>',
            '   </div>',
            '   <img src="/imgs/undraw_booking_re_gw4j.svg" alt="reservas" class="section__img">',
            '</section>',
        ].join("");
    }

    private renderSearch() {
        if (!this.main) throw new Error("Main not found.");
        this.main.innerHTML = [
            '<div class="hotel__container cont">',
            '   <section class="section__hotels" id="hotelsContainer">',
            '   </section>',
            '   <section class="section__map">',
            '       <div id="map"></div>',
            '   </section>',
            '   <nav aria-label="Page navigation example" class="section__pagination">',
            '       <ul class="pagination" id="paginationContainer">',
            '       </ul>',
            '   </nav>',
            '</div>'
        ].join("");
    }

    private addEventFormSearch() {
        setTimeout(() => {
            const formSearch = <HTMLFormElement>document.getElementById('formSearch');
            formSearch.addEventListener("submit", (e: Event) => {
                this.formSearch(e);
            });
        }, 1);
    }

    private formSearch(e: Event) {
        e.preventDefault();
        let inputValue = <HTMLInputElement>document.querySelector('#formSearch input[type="search"]');
        let keyword = inputValue.value;
        if (keyword === "") return;
        this.renderHotels(keyword);
    }

    private showAlert(message: string) {
        if (!this.main) throw new Error("Main not found.");
        this.main.innerHTML = '<div id="liveAlertPlaceholder" class="cont"></div>';
        utilities.createAlert(message, "danger");
    }

    private renderHotels(keyword: string, page?: string) {
        this.renderSearch();// Render container
        let url = `${urls_api.hotels}?search=${encodeURIComponent(keyword)}`;
        if (page) url += `&page=${page}`;
        let response = request.serverRequest(url, "GET")
        response.then((resp: Response) => {
            if (!resp.ok) {
                this.showAlert("Ha ocurrido un error al realizar la busqueda.")
            }
            return resp.json();
        }).then((data) => {
            if (data.results.length == 0) {
                this.showAlert("No se han encontrado resultados para su búsqueda");
                return;
            }

            // Render hotels
            this.createHotels(data.results, keyword);

            // render pagination
            this.createPagination(data.count, data.next, page, data.previous, keyword);
        });
    }

    private createPagination(count: number, next: null | string, current: undefined | string, previous: null | string, keyword: string) {
        let paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer) throw new Error("'pagination' not found.");
        if (!current) current = "1";
        let pages = Math.ceil(count / 9);
        if (next) next = new URLSearchParams(next.substring(next.indexOf("?") + 1)).get("page");
        if (previous) previous = new URLSearchParams(previous.substring(previous.indexOf("?") + 1)).get("page");
        let pagesList: string[] = [];

        if (next) pagesList.push(`<li class="page-item"><a class="page-link" href="${urls_front.home}?search=${keyword}&page=${next}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);
        else pagesList.push(`<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);

        for (let i = 1; i <= pages; i++) {
            if (i == Number(current)) pagesList.push(`<li class="page-item active"><a class="page-link" href="${urls_front.home}?search=${keyword}&page=${i}">${i}</a></li>`);
            else pagesList.push(`<li class="page-item"><a class="page-link" href="${urls_front.home}?search=${keyword}&page=${i}">${i}</a></li>`);
        }

        if (previous) pagesList.push(`<li class="page-item"><a class="page-link" href="${urls_front.home}?search=${keyword}&page=${previous}" aria-label="Previous"><span aria-hidden="true">&raquo;</span></a></li>`);
        else pagesList.push(`<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&raquo;</span></a></li>`);

        paginationContainer.innerHTML = pagesList.join("");
    }

    private createHotelCard(hotel: any) {
        return [
            `<a class="card mb-3 card__content" style="max-width: 540px; text-decoration: none;" href="${urls_front.detail}&id=${hotel.id}">`,
            '   <div class="row g-0">',
            '       <div class="col-md-4">',
            '           <img src="/imgs/ciudad-maderas-MXbM1NrRqtI-unsplash.jpg" class="img-fluid rounded-start card__img" alt="ciudad-maderas">',
            '       </div>',
            '       <div class="col-md-8">',
            '           <div class="card-body">',
            '               <div class="card__title">',
            `                   <h5 class="card-title">${hotel.name}</h5>`,
            '                   <div id="containerRating">',
            '                   </div>',
            '               </div>',
            `               <p class="card-text">${hotel.description.substring(0, 120)}...</p>`,
            `               <p class="card-text"><small class="text-body-secondary">${hotel.city} - ${hotel.state}</small></p>`,
            '           </div>',
            '       </div>',
            '   </div>',
            '</a>'
        ].join("");
    }

    private renderhotelsOnTheMap(hotels: any[], keyword: string) {
        let features: {id: string, name: string, latitude: number, longitude: number}[] = [];
        hotels.forEach((hotel) => {
            features.push({
                id: hotel.id,
                name: hotel.name,
                latitude: hotel.coordinates.latitude,
                longitude: hotel.coordinates.longitude,
            });
        });

        const leaflet = new Leaflet("map", features, {type: "city", zoom: 10, city: keyword});
        leaflet.load();
    }

    private createHotels(hotels: any, keyword: string) {
        let hotelsContainer = document.getElementById("hotelsContainer");
        if (!hotelsContainer) throw new Error("'hotelsContainer' not found.");
        let hotelCards: string[] = [];
        hotels.forEach((hotel: any) => {
            hotelCards.push(this.createHotelCard(hotel));
        })
        hotelsContainer.innerHTML = hotelCards.join("");

        // render map
        this.renderhotelsOnTheMap(hotels, keyword);
    }

    private renderHome() {
        this.renderCarrousel();
        let search = new URLSearchParams(location.search).get("search");
        let page = new URLSearchParams(location.search).get("page");

        if (search && page && !isNaN(Number.parseInt(page))) {
            this.renderHotels(search, page);
        } else this.rederMain();
    }

    public load(): void {
        this.renderHome();
        this.addEventFormSearch();
    }
}