
import axios from "axios";
import { clearTokens, getTokens, setTokens } from "./store/tokens";
import type { Tokens } from "./types/tokens";

export const API_URL = "http://localhost:3000"

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

let refresh_req = false;

api.interceptors.request.use((config) => {
    const access = getTokens()?.access;
    config.headers.Authorization = `Bearer ${access}`;
    return config;
});

api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const config = error.config;

        if (
            error.response.status === 401 &&
            config &&
            !config.sent &&
            !refresh_req
        ) {
            refresh_req = true;
            config.sent = true;
            try {
                const ref = axios.create({
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${getTokens()?.refresh}`,
                        "Content-Type": "application/json",
                    },
                });

                const res = await ref.post<Tokens>(`${API_URL}/api/auth/refresh`);

                setTokens(res.data);

                refresh_req = false;
                return api.request(config);
            } catch (e) {
                console.error(e);
                clearTokens();
                refresh_req = false;
            }
        }
        throw error;
    }
);

export default api;