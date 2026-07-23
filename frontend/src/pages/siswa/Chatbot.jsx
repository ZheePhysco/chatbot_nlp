import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    getMateriChatbot,
    askChatbot,
    askGeminiSiswa
} from "../../services/chatbotService";
import { FaRobot, FaBrain } from "react-icons/fa";

function Chatbot() {
    const location = useLocation();
    const [materi, setMateri] = useState([]);
    const [materiAktif, setMateriAktif] = useState(null);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Halo! 👋 Saya AILA.\nSilakan pilih materi dan ajukan pertanyaanmu.",
            type: "info"
        }
    ]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState("nlp");
    const chatEndRef = useRef(null);

    useEffect(() => {
        loadMateri();
    }, []);

    useEffect(() => {
        if (location.state?.materiId && materi.length > 0) {
            const found = materi.find(
                (m) => m.id === location.state.materiId
            );
            if (found) setMateriAktif(found);
        }
    }, [materi, location.state]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const loadMateri = async () => {
        try {
            const data = await getMateriChatbot();
            setMateri(data);
        } catch (e) {
            console.log(e);
        }
    };

    const kirimPertanyaan = async () => {
        if (!materiAktif) {
            alert("Pilih materi terlebih dahulu.");
            return;
        }
        if (question.trim() === "") return;

        const text = question;
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text }
        ]);
        setQuestion("");
        setLoading(true);

        try {
            let hasil;
            if (mode === "nlp") {
                hasil = await askChatbot(
                    materiAktif.id,
                    text
                );
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: hasil.jawaban,
                        status: hasil.status,
                        similarity: hasil.similarity
                    }
                ]);
            } else {
                hasil = await askGeminiSiswa(
                    materiAktif.id,
                    text
                );
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: hasil.jawaban,
                        status: "Gemini AI"
                    }
                ]);
            }
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Terjadi kesalahan. Coba lagi.",
                    status: "error"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* SIDEBAR MATERI */}
                <div className="col-md-3">
                    <div className="card shadow-sm border-0 mb-3">
                        <div className="card-header fw-bold">
                            Mode Chatbot
                        </div>
                        <div className="card-body">
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={mode === "nlp"}
                                    onChange={() => setMode("nlp")}
                                    id="modeNlp"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="modeNlp"
                                >
                                    <FaRobot className="me-2 text-primary" />
                                    NLP (Offline)
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    checked={mode === "gemini"}
                                    onChange={() => setMode("gemini")}
                                    id="modeGemini"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="modeGemini"
                                >
                                    <FaBrain className="me-2 text-success" />
                                    Gemini AI
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-header fw-bold">
                            Pilih Materi
                        </div>
                        <div
                            className="list-group list-group-flush"
                            style={{
                                maxHeight: "500px",
                                overflowY: "auto"
                            }}
                        >
                            {materi.map((item) => (
                                <button
                                    key={item.id}
                                    className={`list-group-item list-group-item-action ${
                                        materiAktif?.id === item.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setMateriAktif(item)
                                    }
                                >
                                    <div className="fw-bold small">
                                        {item.judul}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CHAT */}
                <div className="col-md-9">
                    <div className="card shadow-sm border-0">
                        <div className="card-header">
                            <div className="fw-bold">
                                {mode === "nlp"
                                    ? "🤖 AILA Chatbot (NLP)"
                                    : "🧠 AILA Chatbot (Gemini AI)"}
                            </div>
                            <small className="text-muted">
                                {materiAktif
                                    ? `Materi: ${materiAktif.judul}`
                                    : "Belum memilih materi"}
                            </small>
                        </div>
                        <div
                            className="card-body"
                            style={{
                                height: "500px",
                                overflowY: "auto",
                                background: "#f5f7fb"
                            }}
                        >
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-3 ${
                                        msg.role === "user"
                                            ? "justify-content-end"
                                            : "justify-content-start"
                                    }`}
                                >
                                    <div
                                        style={{
                                            maxWidth: "75%"
                                        }}
                                    >
                                        <div
                                            className={`p-3 rounded shadow-sm ${
                                                msg.role === "user"
                                                    ? "bg-primary text-white"
                                                    : "bg-white"
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                        {msg.status && (
                                            <div className="mt-1">
                                                <span
                                                    className={`badge ${
                                                        msg.status === "Tidak Relevan"
                                                            ? "bg-danger"
                                                            : msg.status === "Gemini AI"
                                                            ? "bg-success"
                                                            : "bg-primary"
                                                    }`}
                                                >
                                                    {msg.status}
                                                    {msg.similarity &&
                                                        ` • ${(msg.similarity * 100).toFixed(1)}%`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="d-flex">
                                    <div className="bg-white rounded p-3 shadow-sm">
                                        <div
                                            className="spinner-border spinner-border-sm text-primary me-2"
                                            role="status"
                                        />
                                        AILA sedang berpikir...
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <div className="card-footer bg-white">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    placeholder="Ketik pertanyaan..."
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            kirimPertanyaan();
                                        }
                                    }}
                                    disabled={loading}
                                />
                                <button
                                    className={`btn ${
                                        mode === "nlp"
                                            ? "btn-primary"
                                            : "btn-success"
                                    }`}
                                    onClick={kirimPertanyaan}
                                    disabled={loading}
                                >
                                    Kirim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;