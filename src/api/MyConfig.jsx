import axios from "axios"

const url = import.meta.env.VITE_APP_CTO_DATA_BASE_URL

export const axiosInstance = axios.create({
    baseURL: url,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const handleError = (error) => {
    if (error?.response?.data) throw error.response.data;
    throw error;
}