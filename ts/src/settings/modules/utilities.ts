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
    renderSelector(url: string, elementSelectId: string, elementCallback: Function): void {
        let elementSelect = <HTMLSelectElement>document.getElementById(elementSelectId);
        if (!elementSelect) return;

        let response = request.serverRequest(url, "GET");
        response.then(data => data.json()).then((elements: any[]) => {
            elements.forEach((element) => {
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
};