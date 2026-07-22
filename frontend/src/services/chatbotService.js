import api from "./api";

export const getMateriChatbot = async () => {
    const response = await api.get("/materi");
    return response.data;
};

export const askChatbot = async (materiId, pertanyaan) => {
    const response = await api.post(
        "/chat/ask",
        {
            materi_id: materiId,
            pertanyaan: pertanyaan
        }
    );
    return response.data;
};