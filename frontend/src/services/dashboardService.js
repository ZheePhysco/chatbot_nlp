import api from "./api";

export const getDashboardGuru = async () => {
    const response = await api.get(
        "/dashboard/guru"
    );
    return response.data;
};