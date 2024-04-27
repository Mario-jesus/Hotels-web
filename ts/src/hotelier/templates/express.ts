import request from "../../settings/modules/request.js";
import { urls_api, urls_front } from "../../settings/urls.js";

export async function generate_dashboard_stripe_link(): Promise<string> {
    let response = await request.serverRequest(urls_api.dashboardStripeLink, "GET");
    let data = await response.json();

    return data.link;
}

export async function generate_account_link(): Promise<string> {
    let response = await request.serverRequest(
        urls_api.accountLink,
        "POST",
        { refresh: urls_front.home, redirect: urls_front.home },
    );
    let data = await response.json();

    return data.link;
}