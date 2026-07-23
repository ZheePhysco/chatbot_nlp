import api from "./api";

export const getMyHistory = async () => {
    const response = await api.get("/history/my");
    return response.data;
};

export const getAllHistory = async () => {
    const response = await api.get("/history/all");
    return response.data;
};

export const getAnalisis = async () => {
    const response = await api.get("/history/analisis");
    return response.data;
};