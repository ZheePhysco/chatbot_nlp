import { useEffect, useState } from "react";
import {
    getAllHistory,
    getAnalisis
} from "../../services/historyService";
import { FaRobot, FaCheck, FaTimes, FaChartBar } from "react-icons/fa";

function History() {
    const [history, setHistory] = useState([]);
    const [analisis, setAnalisis] = useState(null);
    const [tab, setTab] = useState("riwayat");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [h, a] = await Promise.all([
                getAllHistory(),
                getAnalisis()
            ]);
            setHistory(h);
            setAnalisis(a);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = history.filter(
        (item) =>
            item.pertanyaan
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            item.user
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
                <p className="mt-3">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h3 className="fw-bold mb-1">
                Riwayat & Analisis Chat
            </h3>
            <p className="text-muted mb-4">
                Monitor seluruh aktivitas chatbot siswa
            </p>

            {/* TAB */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${tab === "riwayat" ? "active" : ""}`}
                        onClick={() => setTab("riwayat")}
                    >
                        <FaRobot className="me-2" />
                        Riwayat Chat
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${tab === "analisis" ? "active" : ""}`}
                        onClick={() => setTab("analisis")}
                    >
                        <FaChartBar className="me-2" />
                        Analisis Chat
                    </button>
                </li>
            </ul>

            {/* RIWAYAT */}
            {tab === "riwayat" && (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <input
                                    className="form-control"
                                    placeholder="Cari pertanyaan, siswa, materi..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>No</th>
                                        <th>Siswa</th>
                                        <th>Materi</th>
                                        <th>Pertanyaan</th>
                                        <th>Status</th>
                                        <th>Score</th>
                                        <th>Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length > 0 ? (
                                        filtered.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.user}</td>
                                                <td>{item.materi}</td>
                                                <td
                                                    style={{
                                                        maxWidth: "250px"
                                                    }}
                                                >
                                                    {item.pertanyaan}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            item.status === "Tidak Relevan"
                                                                ? "bg-danger"
                                                                : item.status === "Gemini AI"
                                                                ? "bg-purple text-white"
                                                                : "bg-success"
                                                        }`}
                                                        style={
                                                            item.status === "Gemini AI"
                                                                ? { background: "#6f42c1" }
                                                                : {}
                                                        }
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {item.similarity_score
                                                        ? (item.similarity_score * 100).toFixed(1) + "%"
                                                        : "-"}
                                                </td>
                                                <td>{item.created_at}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4"
                                            >
                                                Belum ada riwayat chat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ANALISIS */}
            {tab === "analisis" && analisis && (
                <div>
                    {/* STAT CARDS */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm border-start border-4 border-primary">
                                <div className="card-body">
                                    <small className="text-muted">
                                        Total Chat
                                    </small>
                                    <h3 className="fw-bold mt-1">
                                        {analisis.total_chat}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm border-start border-4 border-success">
                                <div className="card-body">
                                    <small className="text-muted">
                                        Pertanyaan Relevan
                                    </small>
                                    <h3 className="fw-bold mt-1 text-success">
                                        {analisis.total_relevan}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm border-start border-4 border-danger">
                                <div className="card-body">
                                    <small className="text-muted">
                                        Tidak Relevan
                                    </small>
                                    <h3 className="fw-bold mt-1 text-danger">
                                        {analisis.total_tidak_relevan}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* PER MATERI */}
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0">
                                <div className="card-header fw-bold">
                                    📊 Chat Terbanyak per Materi
                                </div>
                                <div className="card-body">
                                    {analisis.per_materi.length > 0 ? (
                                        analisis.per_materi.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="mb-3"
                                                >
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <small>
                                                            {item.materi}
                                                        </small>
                                                        <small className="fw-bold">
                                                            {item.jumlah}x
                                                        </small>
                                                    </div>
                                                    <div className="progress">
                                                        <div
                                                            className="progress-bar bg-primary"
                                                            style={{
                                                                width: `${
                                                                    (item.jumlah /
                                                                        analisis.total_chat) *
                                                                    100
                                                                }%`
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <p className="text-muted">
                                            Belum ada data.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PERTANYAAN TERBARU */}
                        <div className="col-md-6">
                            <div className="card shadow-sm border-0">
                                <div className="card-header fw-bold">
                                    🕐 Pertanyaan Terbaru
                                </div>
                                <ul className="list-group list-group-flush">
                                    {analisis.pertanyaan_terbaru.map(
                                        (item, index) => (
                                            <li
                                                key={index}
                                                className="list-group-item d-flex justify-content-between align-items-start"
                                            >
                                                <div>
                                                    <p className="mb-1">
                                                        {item.pertanyaan}
                                                    </p>
                                                    <small className="text-muted">
                                                        {item.created_at}
                                                    </small>
                                                </div>
                                                <span
                                                    className={`badge ${
                                                        item.status === "Tidak Relevan"
                                                            ? "bg-danger"
                                                            : "bg-success"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default History;