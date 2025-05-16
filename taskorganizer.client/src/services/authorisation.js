import axios from "axios";

export const tryAuthorise = async (login, password) => {
    try {
        const response = await axios.post("https://localhost:7289/api/Authorisation", {
            login: login,
            password: password
        });
        return response.data;

    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401) {
            throw new Error("Неверный логин или пароль");
        }
        console.error(e);
    }


}