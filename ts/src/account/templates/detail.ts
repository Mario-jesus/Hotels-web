import Detail from "../../customer/templates/detail.js";
import { urls_front } from "../../settings/urls.js";

export default class DetailUser extends Detail {

    constructor() {
        super();
    }

    protected createReservationRedirect(): string {
        return urls_front.signup;
    }
}