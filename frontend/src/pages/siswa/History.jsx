import { useEffect, useState } from "react";
import { getMyHistory } from "../../services/historyService";

function History() {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getMyHistory();
            setHistory(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = history.filter((item) =>
        item.pertanyaan
            .toLowerCase()
            .includes(search.toLowerCase()) ||
        item.materi
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h3 className="fw-bold mb-1">
                Riwayat Chat Saya
            </h3>
            <p className="text-muted mb-4">
                Daftar seluruh pertanyaan yang pernah kamu ajukan
            </p>

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Cari pertanyaan atau materi..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            {filtered.length > 0 ? (
                filtered.map((item) => (
                    <div
                        key={item.id}
                        className="card shadow-sm border-0 mb-3"
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span className="badge bg-secondary me-2">
                                        {item.materi}
                                    </span>
                                    <span
                                        className={`badge ${
                                            item.status === "Tidak Relevan"
                                                ? "bg-danger"
                                                : item.status === "Gemini AI"
                                                ? "bg-success"
                                                : "bg-primary"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                                <small className="text-muted">
                                    {item.created_at}
                                </small>
                            </div>
                            <div className="bg-light rounded p-3 mb-2">
                                <small className="text-muted">
                                    Pertanyaan:
                                </small>
                                <p className="mb-0 fw-semibold">
                                    {item.pertanyaan}
                                </p>
                            </div>
                            {item.jawaban && (
                                <div className="bg-white border rounded p-3">
                                    <small className="text-muted">
                                        Jawaban AILA:
                                    </small>
                                    <p className="mb-0 small">
                                        {item.jawaban.length > 300
                                            ? item.jawaban.substring(0, 300) + "..."
                                            : item.jawaban}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted">
                        Belum ada riwayat chat.
                    </p>
                </div>
            )}
        </div>
    );
}

export default History;