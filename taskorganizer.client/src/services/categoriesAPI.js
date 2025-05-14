import axios from "axios";

export const getCategories = async () => {
    try {
        let token = localStorage.getItem("token");
        
        const response = await axios.get("https://localhost:7289/api/Category", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;

    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401 && localStorage.getItem("token")) {
            throw new Error("Сессия истекла, зайдите заново.");
        } else if (e.response && e.response.status === 401) {
            throw new Error("Войдите в свою учетную запись или зарегистрируйтесь для работы с сервисом.");
        }
        console.error(e);
    }
}
