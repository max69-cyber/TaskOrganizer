import axios from "axios";

export const getTasks = async () => {
    try {
        const response = await axios.get("https://localhost:7289/api/Task", {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi0JjQstCw0L0iLCJleHAiOjE3NDcwODg5MjksImlzcyI6IlRhc2tPcmdhbml6ZXJBUEkiLCJhdWQiOiJUYXNrT3JnYW5pemVyQ2xpZW50In0.rYwkvYuqCUWYHkn45n1N3XaL788iulzLeBbU9wgaf9M`
            }
        });
        return response.data;

    } catch (e) {
        console.error(e);
    }


}