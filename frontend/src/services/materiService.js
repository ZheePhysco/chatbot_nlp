import api from "./api";

export const uploadMateri = async (formData) => {
    const response = await api.post(
        "/materi/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return response.data;
};

export const getMateri = async () => {
    const response = await api.get("/materi");
    return response.data;
};

export const getDetailMateri = async (id) => {
    const response = await api.get(`/materi/${id}`);
    return response.data;
};