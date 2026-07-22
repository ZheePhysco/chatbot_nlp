import { useEffect, useState } from "react";
import {
    askGemini,
    getMateriGemini
} from "../../services/geminiService";

export default function ChatbotGemini() {
    const [materi, setMateri] = useState([]);
    const [materiId, setMateriId] = useState("");
    const [pertanyaan, setPertanyaan] = useState("");
    const [chat, setChat] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMateri();
    }, []);

    const loadMateri = async () => {
        try {
            const data = await getMateriGemini();
            setMateri(data);
        } catch (e) {
            console.log(e);
        }
    };

    const kirim = async () => {
        if (!materiId) {
            alert("Pilih materi terlebih dahulu");
            return;
        }
        if (!pertanyaan.trim()) return;

        const userChat = {
            role: "user",
            text: pertanyaan
        };
        setChat((prev) => [...prev, userChat]);
        setLoading(true);

        try {
            const hasil = await askGemini(
                materiId,
                pertanyaan
            );
            setChat((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: hasil.jawaban
                }
            ]);
            setPertanyaan("");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Terjadi kesalahan"
            );
        }

        setLoading(false);
    };

    return (
        <div className="container-fluid">
            <h3 className="mb-4">
                Chatbot Gemini
            </h3>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={materiId}
                    onChange={(e) =>
                        setMateriId(e.target.value)
                    }
                >
                    <option value="">
                        Pilih Materi
                    </option>
                    {
                        materi.map((m) => (
                            <option
                                key={m.id}
                                value={m.id}
                            >
                                {m.judul}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div
                className="border rounded p-3 mb-3"
                style={{
                    height: "420px",
                    overflowY: "auto"
                }}
            >
                {
                    chat.map((item, index) => (
                        <div
                            key={index}
                            className={
                                item.role === "user"
                                    ? "text-end"
                                    : "text-start"
                            }
                        >
                            <div
                                className={
                                    item.role === "user"
                                        ? "alert alert-primary"
                                        : "alert alert-success"
                                }
                            >
                                {item.text}
                            </div>
                        </div>
                    ))
                }
                {
                    loading && (
                        <p>Gemini sedang berpikir...</p>
                    )
                }
            </div>
            <div className="input-group">
                <input
                    className="form-control"
                    placeholder="Masukkan pertanyaan..."
                    value={pertanyaan}
                    onChange={(e) =>
                        setPertanyaan(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            kirim();
                        }
                    }}
                />
                <button
                    className="btn btn-success"
                    onClick={kirim}
                >
                    Kirim
                </button>
            </div>
        </div>
    );
}