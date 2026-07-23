import api from "./api";

export const getProfile = async () => {
    const response = await api.get("/profile/me");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put(
        "/profile/update",
        data
    );
    return response.data;
};

export const gantiPassword = async (data) => {
    const response = await api.put(
        "/profile/ganti-password",
        data
    );
    return response.data;
};

export const uploadFoto = async (formData) => {
    const response = await api.post(
        "/profile/upload-foto",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return response.data;
};