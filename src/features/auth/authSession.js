import axios from "axios";
import { ACCESS_TOKEN, API_BASE_URL, REFRESH_TOKEN } from "../../Costants";

export function clearAuthState(dispatch) {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    dispatch({ type: "LOGOUT" });
}

export async function refreshAuthSession(dispatch, refreshToken) {
    if (!refreshToken) return false;

    try {
        const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
        });
        const { access, refresh } = response.data || {};
        if (!access) return false;

        localStorage.setItem(ACCESS_TOKEN, access);
        if (refresh) localStorage.setItem(REFRESH_TOKEN, refresh);
        dispatch({ type: "USER_UPDATE", payload: { user: {} } });
        return true;
    } catch {
        return false;
    }
}