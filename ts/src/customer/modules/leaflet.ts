export default class Leaflet {

    constructor(
        private mapId: string,
        private features: {id: string, name: string, latitude: number, longitude: number}[],
        private setView: {
            type: string, zoom: number, city?: string, coordinates?: {latitude: number, longitude: number},
        }
    ) {}

    private async getLocationCoordinates(): Promise<{latitude: number, longitude: number}> {
        if (this.setView.type == "city" && !this.setView.city) throw new Error("No se ha especificado la ciudad o estado.");
        if (this.setView.type == "coordinates" && !this.setView.coordinates) throw new Error("No se han especificado las coordenadas.");
        // @ts-ignore
        if (this.setView.type == "coordinates") return this.setView.coordinates;

        // @ts-ignore
        let url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(this.setView.city);

        let response = await fetch(url);
        let data: any = await response.json();

        return {latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon)};
    }

    private getFeatures(): any[] {
        let features: any[] = [];
        this.features.forEach((item) => {
            features.push(
                {
                    "type": "Feature",
                    "properties": {
                        "name": item.name
                    },
                    "geometry": {
                        "coordinates": [
                            item.longitude,
                            item.latitude,
                        ],
                        "type": "Point"
                    },
                    "id": item.id
                }
            );
        });

        return features;
    }

    private async renderMap(): Promise<void> {
        const locationCoordinates = await this.getLocationCoordinates();
        const features = this.getFeatures();

        // @ts-ignore
        let map = L.map(this.mapId).setView([locationCoordinates.latitude, locationCoordinates.longitude], this.setView.zoom);
        // @ts-ignore
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let pointInterestGJ = {
            "type": "FeatureCollection",
            "features": features,
        };

        // @ts-ignore
        L.geoJSON(pointInterestGJ, {
            style: {
                color: "#ff7800",
                weight: 3,
                opacity: 0.8
            },
            onEachFeature: function(feature: any, layer: any) {
                layer.bindPopup(feature.properties.name).openPopup();
            }
        }).addTo(map);
    }

    public load(): void {
        this.renderMap();
    }
}