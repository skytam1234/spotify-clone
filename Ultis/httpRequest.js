class HttpRequest {
    constructor() {
        this.baseUrl = "https://spotify.f8team.dev/api/";
    }
    async _send(path, method, data, option = {}) {
        try {
            const _options = {
                ...option,
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    ...option?.headers,
                },
                body: data ? JSON.stringify(data) : null,
            };
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                _options.headers.Authorization = `Bearer ${accessToken}`;
            }
            const res = await fetch(`${this.baseUrl}${path}`, _options);
            const responseData = await res.json();
            if (!res.ok) {
                const error = new Error(`HTTP error! status: ${res.status}`);
                error.status = res.status;
                error.response = responseData;
                throw error;
            }
            return responseData;
        } catch (error) {
            const message = error.response.error.details
                ? error.response.error.details[0].message
                : error.response.error.message;
            throw message;
        }
    }
    async get(path, option) {
        return this._send(path, "GET", null, option);
    }
    async post(path, data, option) {
        return this._send(path, "POST", data, option);
    }
    async put(path, data, option) {
        return this._send(path, "PUT", data, option);
    }
    async delete(path, option) {
        return this._send(path, "DELETE", null, option);
    }
    async patch(path, data, option) {
        return this._send(path, "PATCH", data, option);
    }
}
const httpRequest = new HttpRequest();
export default httpRequest;
