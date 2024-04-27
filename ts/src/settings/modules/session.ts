import request from "./request.js";
import { Dictionary } from "./custom_types.js";
import { urls_api } from "../urls.js";

export default class Session {
    sessionData: string | null;

    constructor() {
        this.sessionData = sessionStorage.getItem("sessionData");
    }

    public saveAccountData(data: Dictionary<any>): Dictionary<any> {
        sessionStorage.setItem("sessionData", JSON.stringify(data));
        return data;
    }

    public async getSessionData(): Promise<any> {
        if (this.sessionData) return JSON.parse(this.sessionData);

        return await request.serverRequest(urls_api.user_detail, "GET").then((resp: Response) => {
            if (!resp.ok) {
                throw  new Error(`HTTP error! status: ${resp.statusText}`);
            } else return resp.json();
        }).then((data: any) => {
            return this.saveAccountData(data);
        });
    }

    public async getUserType(): Promise<string> {
        let userType: string;

        try {
            let sessionData = await this.getSessionData();
            userType = sessionData.is_hotelier ? "Hotelier" : "Customer";
        } catch {
            userType = "No logged in";
        }

        return userType;
    }

    public destroySession(): void {
        request.serverRequest(urls_api.logout, "POST").then(() => {
            sessionStorage.removeItem("sessionData");
            window.location.reload();
        });
    }
}