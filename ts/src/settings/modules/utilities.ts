import request from "./request.js";

export default {
    createAlert(message: string, type: string, alertId: string = "liveAlertPlaceholder"): void {
        const alertPlaceholder = <HTMLDivElement>document.getElementById(alertId);
        alertPlaceholder.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('\n');
    },
    showAlert(alertId: string = "liveAlertPlaceholder"): void {
        let alert = sessionStorage.getItem("alert");
        if (alert) {
            sessionStorage.removeItem("alert");
            let json = JSON.parse(alert);
            this.createAlert(json.message, json.type, alertId);
        }
    },
    renderSelector(url: string, elementSelectId: string, elementCallback: Function, result: boolean = true): void {
        let elementSelect = <HTMLSelectElement>document.getElementById(elementSelectId);
        if (!elementSelect) return;

        let response = request.serverRequest(url, "GET");
        response.then(data => data.json()).then((elements: any) => {
            let data: any[] = result ? elements.results : elements;
            data.forEach((element: any) => {
                let option = document.createElement("option");
                let data = elementCallback(element);
                option.value = data.value;
                option.textContent = data.textContent;
                elementSelect.appendChild(option);
            });
        });
    },
    fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result == "string") {
                    resolve(reader.result);
                }
                else reject(`Error converting '${file.name}' to Base64`);
            }
    
            reader.onerror = (err) => {
                reject(err);
            }
    
            reader.readAsDataURL(file);
        });
    },
    createPagination(url_front: string, count: number, next: null | string, current: undefined | string, previous: null | string, params: string = "", initialParameters = false) {
        let paginationContainer = document.getElementById("paginationContainer");
        if (!paginationContainer) throw new Error("'pagination' not found.");
        if (!current) current = "1";
        let pages = Math.ceil(count / 9);
        if (previous) previous = new URLSearchParams(previous.substring(previous.indexOf("?") + 1)).get("page") ?? String(Number(current) - 1);
        if (next) next = new URLSearchParams(next.substring(next.indexOf("?") + 1)).get("page") ?? String(Number(current) + 1);
        let pagesList: string[] = [];

        let page = initialParameters ? "?page=" : "&page=";

        if (previous) pagesList.push(`<li class="page-item"><a class="page-link" href="${url_front}${page}${previous}${params}" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);
        else pagesList.push(`<li class="page-item disabled"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>`);

        for (let i = 1; i <= pages; i++) {
            if (i == Number(current)) pagesList.push(`<li class="page-item active"><a class="page-link" href="${url_front}${page}${i}${params}">${i}</a></li>`);
            else pagesList.push(`<li class="page-item"><a class="page-link" href="${url_front}${page}${i}${params}">${i}</a></li>`);
        }

        if (next) pagesList.push(`<li class="page-item"><a class="page-link" href="${url_front}${page}${next}${params}" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);
        else pagesList.push(`<li class="page-item disabled"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>`);

        paginationContainer.innerHTML = pagesList.join("");
    },
    renderStars(rating: number): string {
        if (rating < 0 || rating > 5) throw new Error("'rating' is not valid.");
        let starList: string[] = [];
        let emptyStar: number = 5 - rating;
        for (let i = 0; i < rating; i++) starList.push('<img class="card__star" src="/imgs/bxs-star-solid.svg" alt="star-solid">');
        for (let i = 0; i < emptyStar; i++) starList.push('<img class="card__star" src="/imgs/bx-star.svg" alt="star">');
        return starList.join("");
    }
};