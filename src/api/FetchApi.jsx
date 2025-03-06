import { axiosInstance, handleError } from "./MyConfig";


export const FetchApi = async(payload) => {
    try{
        const response = await axiosInstance.post('/getCeo', payload)
        return response.data
    }catch(error){
        handleError(error);
    }
}


