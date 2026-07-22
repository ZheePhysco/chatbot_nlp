import { useEffect, useRef, useState } from "react";
import {
    getMateriChatbot,
    askChatbot
} from "../../services/chatbotService";

function Chatbot() {
    const [materi, setMateri] = useState([]);
    const [materiAktif, setMateriAktif] = useState(null);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Halo 👋, saya AILA.\nSilakan pilih materi terlebih dahulu."
        }
    ]);
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        loadMateri();
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const loadMateri = async () => {
        try {
            const data = await getMateriChatbot();
            setMateri(data);
        } catch (err) {
            console.log(err);
        }
    };

    const kirimPertanyaan = async () => {
        if (!materiAktif) {
            alert("Silakan pilih materi terlebih dahulu.");
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
            const hasil = await askChatbot(
                materiAktif.id,
                text
            );
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: hasil.jawaban
                }
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Terjadi kesalahan saat menghubungi server."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-3">
                    <div className="card shadow-sm">
                        <div className="card-header fw-bold">
                            Daftar Materi
                        </div>
                        <div
                            className="list-group list-group-flush"
                            style={{
                                maxHeight: 600,
                                overflowY: "auto"
                            }}
                        >
                            {
                                materi.map((item) => (
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
                                        <div className="fw-bold">
                                            {item.judul}
                                        </div>
                                        <small>
                                            {item.nama_file}
                                        </small>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <div className="fw-bold">
                                Chatbot AILA (NLP)
                            </div>
                            <small>
                                {
                                    materiAktif
                                        ? `Materi : ${materiAktif.judul}`
                                        : "Belum memilih materi"
                                }
                            </small>
                        </div>
                        <div
                            className="card-body"
                            style={{
                                height: "550px",
                                overflowY: "auto",
                                background: "#f5f7fb"
                            }}
                        >
                            {
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`d-flex mb-3 ${
                                            msg.role === "user"
                                                ? "justify-content-end"
                                                : "justify-content-start"
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded shadow-sm ${
                                                msg.role === "user"
                                                    ? "bg-primary text-white"
                                                    : "bg-white"
                                            }`}
                                            style={{ maxWidth: "75%" }}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                loading &&
                                <div className="d-flex">
                                    <div className="bg-white rounded p-3 shadow-sm">
                                        AILA sedang berpikir...
                                    </div>
                                </div>
                            }
                            <div ref={chatEndRef}></div>
                        </div>
                        <div className="card-footer">
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
                                />
                                <button
                                    className="btn btn-primary"
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