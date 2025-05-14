import axios from "axios";

export const getTasks = async () => {
    try {
        let token = localStorage.getItem("token");
        
        const response = await axios.get("https://localhost:7289/api/Task", {
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

export const updateTask = async (task) => {
    try {
        const token = localStorage.getItem("token");
        
        if (!token) {
            throw new Error("Токен не найден, пожалуйста, войдите.");
        }

        const response = await axios.put(
            `https://localhost:7289/api/Task`,
            {
                id: task.id,
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                category: task.category,
                condition: task.condition,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        return response.data;

    } catch (e) {
        console.error(e);
        if (e.response && e.response.status === 401) {
            throw new Error("Войдите в свою учетную запись или зарегистрируйтесь для работы с сервисом.");
        }else if (e.response && e.response.status === 403) {
            throw new Error("У вас нет прав на редактирование этой задачи.");
        } else if (e.response && e.response.status === 404) {
            throw new Error("Задача не найдена.");
        } else {
            throw new Error(e.message);
        }
    }
}

