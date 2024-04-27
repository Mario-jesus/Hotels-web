import { Dictionary } from "./custom_types.js";

export default {
    async serverRequest(url: string, method: string, data: Dictionary<any> | null = null): Promise<any> {
        try {
            let csrftoken = this.getCookie("csrftoken");
            let headers: Dictionary<string> = {"Content-Type": "application/json; charset=UTF-8"};
            if (csrftoken) headers["X-CSRFToken"] = csrftoken;
            let values: Dictionary<any> = { method, headers, credentials: "include" };
            if (data) values["body"] = JSON.stringify(data);
            return await fetch(url, values);

        } catch (error) {
            throw error;
        }
    },
    getCookie(name: string): string | null {
        let cookieValue: string | null = null;
        if (document.cookie && document.cookie !== '') {
            const cookies: string[] = document.cookie.split(';');
            for (let cookie of cookies) {
                let parts: string[] = cookie.split('=');
                let cookieName: string = parts[0].trim();
                if (cookieName === name) {
                    cookieValue = parts[1].trim();
                    break;
                }
            }
        }

        return cookieValue;
    }
}
