import api from "./api";

export const askGemini = async (materiId, pertanyaan) => {
    const response = await api.post(
        "/chat/gemini",
        {
            materi_id: materiId,
            pertanyaan: pertanyaan
        }
    );
    return response.data;
};

export const getMateriGemini = async () => {
    const response = await api.get("/materi");
    return response.data;
};