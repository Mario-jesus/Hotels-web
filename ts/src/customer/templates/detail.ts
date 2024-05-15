import request from "../../settings/modules/request.js";
import { urls_api, urls_front } from "../../settings/urls.js";
import { HotelModel, servicesHotelMany, room_types, imagesMany } from "../../hotelier/modules/interfaces.js";
import utilities from "../../settings/modules/utilities.js";
import Leaflet from "../modules/leaflet.js";
import { ImagesByCategory } from "../modules/custom_types.js";

export default class Detail {
    private main: HTMLElement | null;
    private currentImage: {id: string, description?: string, image: string}[];

    constructor() {
        this.main = document.getElementById("main");
        this.currentImage = [];
    }

    private renderDetailContainer(hotel: HotelModel) {
        if (!this.main) throw new Error("'main' not found.");

        // Crear parrafos en los textos
        let description = hotel.description.split("\n");
        description = description.map((line) => `<p>${line}</p>`);
        let address = hotel.address.split("\n");
        address = address.map((line) => `<p>${line}</p>`);

        this.main.innerHTML = [
            '<div class="detail cont">',
            '   <section class="section section--header">',
            `       <h3 class="title-1">${hotel.name}</h3>`,
            '       <div class="rating" id="hotelRating"></div>',
            '   </section>',
            '   <section class="section section--pictures">',
            '       <input type="text" id="currentImage" title="currentImage" style="display: none;">',
            '       <label for="showModal" class="gallery__container" id="coverImage"></label>',
            '       <input type="checkbox" id="showModal" style="display: none;">',
            '       <div class="modal__gallery">',
            '           <div class="modal__head">',
            '               <label class="modal__close" for="showModal">',
            '                   <img src="/imgs/bx-close.svg" alt="close">',
            '               </label>',
            '               <label class="btn btn-outline-primary showDescription" for="showDescription">Descripción</label>',
            '           </div>',
            '           <div class="imageContainer">',
            '               <figure class="imageContent">',
            '                   <img id="imageMain">',
            '                   <input type="checkbox" id="showDescription" style="display: none;">',
            '                   <div class="descriptionContainer" id="imageDescription"></div>',
            '               </figure>',
            '               <div class="imageController">',
            '                   <button class="controller__btn" id="imagePrev" type="button">',
            '                       <img src="/imgs/bxs-chevron-left.svg" alt="left">',
            '                   </button>',
            '                   <button class="controller__btn" id="imageNext" type="button">',
            '                       <img src="/imgs/bxs-chevron-right.svg" alt="right">',
            '                   </button>',
            '               </div>',
            '           </div>',
            '           <div class="cont" id="categoryContainer"></div>',
            '           <div class="cont" id="picturesContainer"></div>',
            '       </div>',
            '   </section>',
            `   <section class="section section--description texts">${description.join("")}</section>`,
            '   <section class="section section--services">',
            '       <h4 class="title-3">Servicios que ofrecemos</h4>',
            '       <ul class="services" id="hotelServices"></ul>',
            '   </section>',
            '   <section class="section section--address">',
            '       <div class="address__head">',
            '           <h4 class="title-3">Ubicación</h4>',
            `           <div class="region">${hotel.city}, ${hotel.state}</div>`,
            '       </div>',
            `       <div class="address texts" id="hotelAddress">${address.join("")}</div>`,
            '       <div class="contact">',
            `           <p class="tel">Teléfono: <span id="phone">${hotel.phone}</span></p>`,
            '       </div>',
            '       <div class="map" id="mapDetail"></div>',
            '   </section>',
            '   <section class="section section--availability">',
            '       <h4 class="title-3">Disponibilidad</h4>',
            '       <div id="liveAlertPlaceholder"></div>',
            '       <div class="availability__head">',
            '           <form action="" class="form__availability" id="getAvailability">',
            '               <div class="availability__item">',
            '                   <label for="checkIn">Fecha de entrada:</label>',
            '                   <input class="calculateAmount" type="date" id="checkIn">',
            '               </div>',
            '               <div class="availability__item">',
            '                   <label for="checkOut">Fecha de Salidad:</label>',
            '                   <input class="calculateAmount" type="date" id="checkOut">',
            '               </div>',
            '               <input type="submit" value="Ver disponibilidad" class="btn btn-primary">',
            '           </form>',
            '           <div class="reservation__container">',
            '               <div style="display: flex; align-items: center; gap: 2em;">',
            '                   <div style="font-size: 1.3rem; font-weight: 600;">Total: <span id="amount">0</span> MXN</div>',
            '                   <button class="btn btn-warning" id="btnReserve">Reservar ahora</button>',
            '               </div>',
            '               <div class="row g-3 needs-validation">',
            '                   <div class="col-md-12">',
            '                       <label for="inputEmail" class="form-label">Correo electronico:</label>',
            '                       <div class="input-group has-validation">',
            '                           <input type="email" class="form-control" id="inputEmail">',
            '                           <div id="inputEmailFeedback" class="invalid-feedback"></div>',
            '                       </div>',
            '                   </div>',
            '                   <div class="col-md-6">',
            '                       <label for="inputFullName" class="form-label">Nombre:</label>',
            '                       <div class="input-group has-validation">',
            '                           <input type="text" class="form-control" id="inputFullName">',
            '                           <div id="inputFullNameFeedback" class="invalid-feedback"></div>',
            '                       </div>',
            '                   </div>',
            '                   <div class="col-md-6">',
            '                       <label for="inputPhone" class="form-label">Teléfono:</label>',
            '                       <div class="input-group has-validation">',
            '                           <input type="tel" class="form-control" id="inputPhone">',
            '                           <div id="inputPhoneFeedback" class="invalid-feedback"></div>',
            '                       </div>',
            '                   </div>',
            '               </div>',
            '           </div>',
            '       </div>',
            '       <div class="table-responsive">',
            '           <table class="table align-middle table-bordered table__rooms">',
            '               <thead>',
            '                   <tr>',
            '                       <th>Tipo de habitación</th>',
            '                       <th>Capacidad de personas</th>',
            '                       <th>Precio de la habitación</th>',
            '                       <th>Seleccionar habitaciones</th>',
            '                   </tr>',
            '               </thead>',
            '               <tbody id="roomsContainer"></tbody>',
            '           </table>',
            '       </div>',
            '   </section>',
            '</div>',
        ].join("");
    }

    private getArrayOfImagesByCategory(images: imagesMany[]): ImagesByCategory {
        let imagesByCategory: ImagesByCategory = {all: {id: 0, images: []}};
        // Imagenes por categoria
        images.forEach((image) => {
            if (imagesByCategory.hasOwnProperty(image.category.name)) {
                imagesByCategory[image.category.name].images.push({id: image.id, description: image.description, image: image.image});
            } else {
                imagesByCategory[image.category.name] = {id: image.category.id, images: [{id: image.id, description: image.description, image: image.image}]};
            }

            // Imagenes generales
            imagesByCategory.all.images.push({id: image.id, description: image.description, image: image.image})
        });

        return imagesByCategory;
    }

    private addImageEvent(images: any[], imageClass: string, renderImage: boolean = false) {
        const currentImageElement = <HTMLInputElement>document.getElementById("currentImage");
        const imageElementList = <NodeListOf<HTMLImageElement>>document.querySelectorAll(`.${imageClass}`);
        imageElementList.forEach((imageElement) => {
            imageElement.addEventListener("click", () => {
                currentImageElement.value = imageElement.alt;
                if (renderImage) {
                    this.currentImage = images;
                    this.renderImage();
                }
                else this.setImageMain();
            });
        });
    }

    private coverImage(images: imagesMany[]) {
        let coverImage = document.getElementById("coverImage");
        if (images.length < 1 || !coverImage) return;
        let iter = images.length > 8 ? 8 : images.length;

        let coverImageList: string[] = [];
        for (let i = 0; i < iter; i++) {
            coverImageList.push(`<img class="coverImageItem" src="${images[i].image}" alt="${i}">`);
        }
        coverImage.innerHTML = coverImageList.join("");

        // Manejar los eventos de las imagenes agregadas
        let imageData = this.getArrayOfImagesByCategory(images).all.images;
        this.addImageEvent(imageData, "coverImageItem", true);
    }

    private setImageMain() {
        let imageMain = <HTMLImageElement>document.getElementById("imageMain");
        let imageDescription = <HTMLDivElement>document.getElementById("imageDescription");
        let btnShowDescription = <HTMLButtonElement>document.querySelector(".showDescription");

        // Obtener pocisión de la imagen
        let currentImagePosition = this.getCurrentImagePosition();

        // Establecer imagen principal
        imageMain.src = this.currentImage[currentImagePosition].image;
        imageMain.alt = this.currentImage[currentImagePosition].id;

        // Establecer la descripción si la hay
        if (this.currentImage[currentImagePosition].description) {
            btnShowDescription.style.display = "block";
            imageDescription.style.opacity = "100%";
            imageDescription.innerText = this.currentImage[currentImagePosition].description ?? "";
        } else {
            btnShowDescription.style.display = "none";
            imageDescription.style.opacity = "0%";
        }

        // Activar o desactivar los botones controladores de la imagen
        let imagePrev = <HTMLButtonElement>document.getElementById("imagePrev");
        let imageNext = <HTMLButtonElement>document.getElementById("imageNext");
        if (currentImagePosition == 0) imagePrev.disabled = true;
        else imagePrev.disabled = false;
        if (currentImagePosition == this.currentImage.length - 1) imageNext.disabled = true;
        else imageNext.disabled = false;

    }

    private getCurrentImagePosition(): number {
        let currentImageElement = <HTMLInputElement>document.getElementById("currentImage");
        let currentImage: number = currentImageElement.value == "" ? 0 : parseInt(currentImageElement.value);
        if (currentImage > this.currentImage.length || currentImage < 0) currentImage = 0;

        return currentImage;
    }

    private imagebuttonHandlerEvent() {
        let currentImageElement = <HTMLInputElement>document.getElementById("currentImage");
        let imagePrev = <HTMLButtonElement>document.getElementById("imagePrev");
        let imageNext = <HTMLButtonElement>document.getElementById("imageNext");

        imagePrev.addEventListener("click", () => {
            let currentImagePosition = this.getCurrentImagePosition();
            currentImageElement.value = String(currentImagePosition - 1);
            this.setImageMain();
        });

        imageNext.addEventListener("click", () => {
            let currentImagePosition = this.getCurrentImagePosition();
            currentImageElement.value = String(currentImagePosition + 1);
            this.setImageMain();
        });
    }

    private renderImage() {
        let picturesContainer = <HTMLDivElement>document.getElementById("picturesContainer");

        // Establecer imagen principal
        this.setImageMain();

        // Renderizar el resto de imagenes
        let imageList: string[] = [];
        this.currentImage.forEach((img, index) => {
            imageList.push(`<img class="imageItem" src="${img.image}" alt="${index}">`);
        });
        picturesContainer.innerHTML = imageList.join("");

        // Agregar eventos a las imagenes del contenedor
        this.addImageEvent(this.currentImage, "imageItem");
    }

    private handleCategoryButtonEvents(imagesByCategory: ImagesByCategory) {
        let currentImage = <HTMLInputElement>document.getElementById("currentImage");
        // Agregar eventos a los botones de categoria
        for (let category in imagesByCategory) {
            let button = <HTMLButtonElement>document.getElementById(`btn_${imagesByCategory[category].id}`);
            button.addEventListener("click", () => {
                currentImage.value = "";// Restablecer la posicion de las imagenes
                // Establecer el nuevo arreglo y renderizarlo
                this.currentImage = imagesByCategory[category].images;
                this.renderImage();
            });
        }
    }

    private renderCategoryButtons(images: imagesMany[]) {
        let categoryContainer = <HTMLDivElement>document.getElementById("categoryContainer");
        let imagesByCategory = this.getArrayOfImagesByCategory(images);
        let buttonsList: string[] = ['<button type="button" id="btn_0" class="btn btn-light">Todos</button>'];
        for (let category in imagesByCategory) {
            if (category === "all") continue;
            buttonsList.push(`<button type="button" id="btn_${imagesByCategory[category].id}" class="btn btn-light">${category}</button>`);
        }
        categoryContainer.innerHTML = buttonsList.join("");

        // Agregar eventos
        this.handleCategoryButtonEvents(imagesByCategory);
    }

    private renderGallery(images: imagesMany[]): void {
        // Cover image
        this.coverImage(images);

        // Renderizar botones de categorias
        this.renderCategoryButtons(images);

        // Agregar eventos los botones controladores del cambio de imagnes
        this.imagebuttonHandlerEvent();
    }

    private renderServices(services: servicesHotelMany[]) {
        const servicesContainer = <HTMLUListElement>document.getElementById("hotelServices");
        let servicesList: string[] = [];
        services.forEach((service) => {
            servicesList.push(`<li>${service.service.name}</li>`)
        });
        servicesContainer.innerHTML = servicesList.join("");
    }

    private renderRooms(roomTypes: room_types[]) {
        const roomsContainer = <HTMLElement>document.getElementById("roomsContainer");
        let roomTypeList: string[] = [];
        roomTypes.forEach((roomType) => {
            let description = roomType.description !== undefined ? roomType.description : "";
            let capacity = roomType.capacity > 1 ? `${roomType.capacity} Personas` : "1 Persona";
            let available = roomType.rooms > 1 ? `Contamos con ${roomType.rooms} habitaciones` : `Contamos con ${roomType.rooms} habitación`;
            let rooms: string[] = [];
            for (let i = 0; i <= roomType.rooms; i++) rooms.push(`<option value="${roomType.id}">${i}</option>`);

            roomTypeList.push([
                '<tr>',
                '   <td>',
                `       <div class="room__title">${roomType.type}</div>`,
                `       <li class="room__available" id="available_${roomType.id}">${available}</li>`,
                `       <div class="room__description">${description}</div>`,
                '   </td>',
                `   <td>${capacity}</td>`,
                `   <td>${roomType.price} MXN</td>`,
                '   <td>',
                `       <select title="Habitaciones" data-price="${roomType.price}" class="roomSelectors calculateAmount" id="select_${roomType.id}">`,
                `           ${rooms.join("")}`,
                '       </select>',
                '   </td>',
                '</tr>'
            ].join(""));

            roomsContainer.innerHTML = roomTypeList.join("");
        });
    }

    private renderMap(hotel: HotelModel) {
        let leaflet = new Leaflet(
            "mapDetail",
            [{
                id: hotel.id,
                name: hotel.name,
                latitude: parseFloat(hotel.coordinates.latitude),
                longitude: parseFloat(hotel.coordinates.longitude)
            }],
            {
                type: "coordinates",
                zoom: 16,
                coordinates: {latitude: parseFloat(hotel.coordinates.latitude),
                longitude: parseFloat(hotel.coordinates.longitude)}
            }
        );

        leaflet.load();
    }

    private getAvailability() {
        const hotelId = new URLSearchParams(location.search).get("id");
        if (!hotelId) throw new Error("No se ha proporcionado un hotel válido."); 
        const form = document.getElementById("getAvailability");
        if (!form) return;

        form.addEventListener("submit", (e: Event) => {
            e.preventDefault();
            let checkIn = <HTMLInputElement>document.getElementById("checkIn");
            let checkOut = <HTMLInputElement>document.getElementById("checkOut");
            if (checkIn.value == "" || checkOut.value == "") utilities.createAlert("Los campos de las fechas son requeridos.", "danger");
            let url = `${urls_api.roomAvailability}?id_hotel=${hotelId}&date_from=${checkIn.value}&date_to=${checkOut.value}`;
            const response = request.serverRequest(url, "GET");

            response.then((data: Response) => data.json()).then((room_availability: any) => {
                let roomTypes: any[] = room_availability.room_types;
                roomTypes.forEach((roomType: any) => {
                    const availableContainer = <HTMLElement>document.getElementById(`available_${roomType.id}`);
                    const selectContainer = <HTMLElement>document.getElementById(`select_${roomType.id}`);

                    let available = roomType.rooms_available > 0 ? `Solo quedan ${roomType.rooms_available} habitaciones en nuestra web.` : `Lo sentimos no contamos con habitaciones disponibles.`;
                    let rooms: string[] = [];
                    for (let i = 0; i <= roomType.rooms_available; i++) rooms.push(`<option value="${roomType.id}">${i}</option>`);

                    availableContainer.innerText = available;
                    selectContainer.innerHTML = rooms.join("");
                });
            });
        });
    }

    private createReservation() {
        const button = <HTMLElement>document.getElementById("btnReserve");
        button.addEventListener("click", (e: Event) => {
            e.preventDefault();
            let hotel = new URLSearchParams(location.search).get("id");
            if (!hotel) return;
            const checkIn = <HTMLInputElement>document.getElementById("checkIn");
            const checkOut = <HTMLInputElement>document.getElementById("checkOut");
            const email = <HTMLInputElement>document.getElementById("inputEmail");
            const name = <HTMLInputElement>document.getElementById("inputFullName");
            const phone = <HTMLInputElement>document.getElementById("inputPhone");
            const selectors = <NodeListOf<HTMLSelectElement>>document.querySelectorAll(".roomSelectors");

            let bedrooms: {room_type: string, rooms: number}[] = [];
            selectors.forEach((selector) => {
                if (selector.selectedIndex > 0) bedrooms.push({room_type: selector.value, rooms: selector.selectedIndex});
            });

            // Validaciones
            if (!checkIn.value || !checkOut.value) {
                utilities.createAlert("Los campos de las fechas son requeridos.", "danger");
            } else if (bedrooms.length == 0) {
                utilities.createAlert("No ha seleccionado ninguna habitación.", "danger");
            } else if (!name.value || !email.value || !phone.value) {
                utilities.createAlert("Por favor rellene todos los campos.", "danger");
            } else {
                // Juntar datos
                let data = {
                    hotel, email: email.value, name: name.value, phone: phone.value,
                    checkin: checkIn.value, checkout: checkOut.value, bedrooms,
                };

                // Guardar los datos en el sesion storage y rediridigir al usuario al checkout
                sessionStorage.setItem("reservationData", JSON.stringify(data));
                location.href = urls_front.checkout;
            }
        });
    }

    private setAmount() {
        const day: number = 86400000;// Un dia en milisegundos
        const calculateAmountElements = document.querySelectorAll(".calculateAmount");
        const amountElement = <HTMLElement>document.getElementById("amount");

        const selectors = <NodeListOf<HTMLSelectElement>>document.querySelectorAll(".roomSelectors");
        const checkIn = <HTMLInputElement>document.getElementById("checkIn");
        const checkOut = <HTMLInputElement>document.getElementById("checkOut");

        calculateAmountElements.forEach((element) => {
            element.addEventListener("change", () => {
                // Precios y dias
                let totalDays: number = 0;
                let price: number = 0;

                // Calcular total de dias
                if (checkIn.value && checkOut.value) {
                    let dateIn: any = new Date(checkIn.value);
                    let dateOut: any = new Date(checkOut.value);
                    totalDays = (dateOut - dateIn) / day;
                }

                selectors.forEach((selector) => {
                    if (selector.selectedIndex > 0) price += selector.selectedIndex * parseFloat(selector.dataset.price ?? "0");
                });

                // Establecer precio total
                amountElement.innerText = String(totalDays * price);
            });
        });
    }

    private createErrorAlert(message: string) {
        if (!this.main) return;
        this.main.innerHTML = '<div class="cont" id="liveAlertPlaceholder"></div>';
        utilities.createAlert(message, "danger");
    }

    private addEventListener() {
        this.getAvailability();
        this.createReservation();
        this.setAmount();
    }

    private getHotel() {
        let hotelId = new URLSearchParams(location.search).get("id");
        if (!hotelId) throw new Error("No se ha proporcionado un hotel válido.");        
        let response = request.serverRequest(`${urls_api.hotels}${hotelId}`, "GET");
        response.then((data: Response) => {
            if (!data.ok) {
                this.createErrorAlert("Ha ocurrido un error al intentar cargar el hotel.");
                throw new Error("Error al cargar el hotel");
            }
            return data.json();
        }).then((hotel: HotelModel) => {
            this.renderComponents(hotel);
        });
    }

    private renderComponents(hotel: HotelModel) {
        this.main?.classList.add("main--detail");
        this.renderDetailContainer(hotel);

        if (hotel.images && hotel.images.length > 0) this.renderGallery(hotel.images);
        if (hotel.services && hotel.services.length > 0) this.renderServices(hotel.services);
        if (hotel.room_types && hotel.room_types.length > 0) this.renderRooms(hotel.room_types);
        this.renderMap(hotel);

        // Escuchar eventos
        this.addEventListener();
    }

    public load() {
        this.getHotel();
    }
}