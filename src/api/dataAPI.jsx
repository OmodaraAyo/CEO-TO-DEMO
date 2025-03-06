import axios from "axios"
import { axiosInstance, handleError } from "./config"

export const dataApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/getCeo', payload)
        return response.data
    }catch(error){
        handleError(error);
    }
}


