import request from "../../settings/modules/request.js";
import utilities from "../../settings/modules/utilities.js";
import { FormElement } from "./interfaces.js";

export default abstract class FormTemplate {
    private main: HTMLElement | null;

    // typeForm => "register" | "edit"
    constructor(
        protected urlApi: string,
        protected postEvent: {redirectURL: string, removalRedirectURL?: string, showMessage: boolean},
        protected typeForm: string,
    ) {
        this.main = document.getElementById("main");
    }

    protected validateField(
        idElement: string, idElementFeedback: string,
        option: {
            typeElement: string;
            required: boolean;
            min_length?: number;
            max_length?: number;
            isInteger?: boolean;
        }
    ): any {
        let value: any;
        let isValid = false;
        const element = <any>document.getElementById(idElement);
        const feedback = <HTMLDivElement>document.getElementById(idElementFeedback);

        if (!element || !feedback) throw new Error(`El elemento '${idElement}' no existe.`);

        if (!element.classList.contains("is-invalid")) element.classList.add("is-invalid");
        if (!feedback.classList.contains("invalid-feedback")) feedback.classList.add("invalid-feedback");

        switch (option.typeElement) {
            case "text":
                if (option.required && element.value.length === 0) {
                    feedback.innerText = "Este campo es obligatorio.";
                } else if (element.value.length !== 0 && option.min_length && element.value.length < option.min_length) {
                    feedback.innerText = `Este campo debe tener más de ${option.min_length} carácteres.`;
                } else if (option.max_length && element.value.length > option.max_length) {
                    feedback.innerText = `Este campo debe tener menos de ${option.max_length} carácteres.`;
                } else {
                    isValid = true;
                    if (!option.required && element.value.length === 0) value = null;
                    else value = element.value;
                };
                break;

            case "number":
                if (option.required && element.value.length === 0) {
                    feedback.innerText = "Este campo es obligatorio.";
                } else if (isNaN(Number(element.value))) {
                    feedback.innerText = "Este campo solo acepta valores numéricos.";
                } else if (option.isInteger && !Number.isInteger(Number(element.value))) {
                    feedback.innerText = "Este campo solo acepta valores numéricos enteros.";
                } else if (element.value.length !== 0 && option.min_length && Number(element.value) < option.min_length) {
                    feedback.innerText = `Este número no puede ser menor a ${option.min_length}.`;
                } else if (option.max_length && Number(element.value) > option.max_length) {
                    feedback.innerText = `Este número no puede ser mayor a ${option.max_length}.`;
                } else {
                    isValid = true;
                    if (!option.required && element.value.length === 0) value = null;
                    else value =  Number(element.value);
                };
                break;

            case "checkbox":
                isValid = true;
                value = element.checked;
                break;

            case "select":
                let uuidv4Regex: RegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                if (option.required && element.selectedIndex === 0) {
                    feedback.innerText = "Seleccione una opción en este campo.";
                } else if (!uuidv4Regex.test(element.value) && !option.isInteger) {
                    feedback.innerText = "Por favor, seleccione un valor válido.";
                } else {
                    isValid = true;
                    if (!option.required && element.selectedIndex === 0) value = null;
                    else value = element.value;
                };
                break;

            case "file":
                if (option.required && element.files.length == 0) {
                    feedback.innerText = "Este archivo es requerido.";
                } else if (option.max_length && element.files[0].size > option.max_length) {
                    feedback.innerText = 'El tamaño del archivo supera el límite permitido.';
                } else {
                    isValid = true;
                    if (!option.required && element.files.length == 0) value = null;
                    else value = element.files[0];
                }
                break;

            default:
                throw new Error(`Unknown value '${option.typeElement}'.`);
        }

        if (isValid) {
            feedback.innerText = "¡Se ve bien!";
            element.classList.replace("is-invalid", "is-valid");
            feedback.classList.replace("invalid-feedback", "valid-feedback");

            return value;

        } else throw new Error(`The element '${idElement}' is not valid.`);
    }

    protected eventFormError(resp: Response) {
        let data: Promise<any> = resp.json();
        data.then((msg) => console.error(msg));
        throw new Error(resp.statusText);
    }

    protected eventFormSuccess(data: any) {}

    private eventForm(url: string, method: string, formId: string = "formTemplate", loadData: boolean = true) {
        const form = <HTMLFormElement|null>document.getElementById(formId);
        if (!form) throw new Error('Form not found.');

        // Asignar evento de envío del formulario
        form.addEventListener("submit", async (event: Event) => {
            event.preventDefault();

            // loadData
            let formData = undefined;
            if (loadData) formData = await this.getFormAttributes();

            request.serverRequest(url, method, formData).then((resp: Response) => {
                if (!resp.ok) {
                    this.eventFormError(resp);
                } else {
                    try {
                        return resp.json();
                    } catch {
                        return;
                    }
                }
            }).then((data: any) => {
                // Hacer algo con la información de respuesta
                this.eventFormSuccess(data);

                if (this.postEvent.showMessage) {
                    // Crear tipo de mensaje
                    let actionMsg: string;
                    if (method == "POST") actionMsg = "registrado";
                    else if (method == "PUT") actionMsg = "actualizado";
                    else if (method == "DELETE") actionMsg = "borrado";
                    else throw new Error(`Método ${method} no soportado.`);

                    // Guardar el mensaje en sessionStorage
                    sessionStorage.setItem("alert", JSON.stringify({"type": "success", "message": `El recurso ha sido ${actionMsg} correctamente.`}));
                }

                // Recargar o redireccionar la pagina
                if (method === "DELETE" && this.postEvent.removalRedirectURL) location.href = this.postEvent.removalRedirectURL;
                else if (this.postEvent.redirectURL == "reload") location.reload();
                else location.href = this.postEvent.redirectURL;
            }).catch(err => console.error(err));
        });
    }

    private handleTypeForm(): void {
        switch (this.typeForm) {
            case "register":
                this.registerForm();
                break;

            case "edit":
                this.editForm();
                break;

            default:
                throw new Error(`Tipo de formulario desconocido: "${this.typeForm}"`);
        }
    }

    protected rederForm(): void {
        let form = this.formTemplate();

        if (this.typeForm === "edit") {
            form += [
                '<form class="d-grid gap-2" id="deleteForm" style="max-width: 1000px; margin: 0 auto 2em !important; padding: 0 1.5em;">',
                '   <input type="submit" value="Borrar" class="btn btn-danger">',
                '</form>'
            ].join("");
        }

        if (this.main) {
            this.main.innerHTML += form;
        } else {
            throw new Error("Can't find the element with id `main`.");
        }
    }

    protected registerForm(): void {
        this.eventForm(this.urlApi, "POST");
    }

    protected editForm(): void {
        // Obtener el ID del los parametros de la URL
        let params = new URLSearchParams(location.search);
        const id = params.get("id");
        if (!id) {
            utilities.createAlert("No se proporcionó ninguna identificación para editar.", "danger");
            throw new Error("No ID provided for editing.");
        }

        const url = `${this.urlApi}${id}/`;

        // Consultar información del elemento y llenar los campos correspondientes
        request.serverRequest(url, "GET").then(data => data.json()).then((element: any) => {
            this.fillFields(element);
        }).catch((err) => {
            console.error("Error al cargar los datos del elemento a editar: ", err);
        });

        // Asignar envio del formulario
        this.eventForm(url, "PUT");

        // Asignar evento de borrado
        this.eventForm(url, "DELETE", "deleteForm", false);
    }

    private createFormElements(type: {typeElement: string, typeInput?: string }, cls: string, nameId: string, nameLabel: string, nameSelect?: string, attributes?: any) {
        let element: string = "";
        let attrs: string = "";
        if (attributes) for (let i in attributes) attrs += `${i}="${attributes[i]}" `;

        switch (type.typeElement) {
            case "input":
                if (!type.typeInput) throw Error("Se requiere un tipo de input.")
                element = `<input type="${type.typeInput}" class="form-control" id="input${nameId}" ${attrs}>`;
                break;

            case "textarea":
                element = `<textarea id="input${nameId}" class="form-control" ${attrs}></textarea>`;
                break;

            case "checkbox":
                element = `<input type="checkbox" class="form-check-input" id="input${nameId}" ${attrs}>`;
                break;

            case "select":
                if (!nameSelect) throw Error("Se requiere un nombre para select.");
                element = [
                    `<select class="form-select" id="input${nameId}">`,
                    `   <option selected>${nameSelect}</option>`,
                    '</select>',
                ].join("");
                break;

            default:
                break;
        }

        return [
            `<div class="${cls}">`,
            `   <label for="input${nameId}" class="form-label">${nameLabel}</label>`,
            '   <div class="input-group has-validation">',
            `       ${element}`,
            `       <div id="input${nameId}Feedback" class="invalid-feedback"></div>`,
            '   </div>',
            '</div>'
        ].join("");
    }

    protected createForm(title: string, buttonName: string, elements: FormElement[]) {
        let formElements: string[] = [];
        elements.forEach(element => {
            let formElement = this.createFormElements(element.type, element.cls, element.nameId, element.nameLabel, element?.nameSelect, element?.attributes);
            formElements.push(formElement);
        });

        return [
            '<form class="row g-3 m-5 mt-3" id="formTemplate" style="max-width: 1000px; margin: 0 auto 0 !important; padding: 1em">',
            '   <div id="liveAlertPlaceholder"></div>',
            `   <h3 class="text-center">${title}</h3>`,
            `   ${formElements.join("")}`,
            '   <div class="col-12 d-grid gap-2 mt-4 mb-1">',
            `       <button type="submit" class="btn btn-primary">${buttonName}</button>`,
            '   </div>',
            '</form>'
        ].join("");
    }

    protected formTemplate(): string {
        return "";
    }

    protected fillFields(element: any): void {}

    protected async getFormAttributes(): Promise<any> {}

    public load(): void {
        this.rederForm();
        utilities.showAlert();
        this.handleTypeForm();
    }
}