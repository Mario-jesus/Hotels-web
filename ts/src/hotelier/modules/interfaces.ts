export interface HotelModel {
    id: string;
    hotelier: string;
    name: string;
    description: string;
    phone: string
    address: string;
    city: string;
    state: string;
    rating: number;
    coordinates: {
        latitude: string;
        longitude: string;
    };
    services?: servicesHotelMany[];
    images?: imagesMany[];
    room_types?: room_types[];
};

export interface servicesHotelMany {
    id: string;
    price?: string;
    description?: string;
    service: services;
};

export interface servicesHotel {
    id: string;
    hotel: string;
    price?: string;
    description?: string;
    service: number;
};

export interface services {
    id: number;
    name: string;
};

export interface imagesMany {
    id: string;
    image: string;
    description?: string;
    category: imageCategory;
}

export interface images {
    id: string;
    hotel: string;
    image: string;
    description?: string;
    category: number;
};

export interface imageCategory {
    id: number;
    name: string;
};

export interface room_types {
    id: string;
    hotel: string;
    type: string;
    capacity: number;
    price: string;
    rooms: number;
    description?: string;
};

export interface FormElement {
    type: {typeElement: string, typeInput?: string };
    cls: string;
    nameId: string;
    nameLabel: string;
    nameSelect?: string;
    attributes?: any;
}