import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMateri } from "../../services/materiService";
import { getMyHistory } from "../../services/historyService";
import {
    FaBook,
    FaRobot,
    FaHistory,
    FaCheckCircle
} from "react-icons/fa";

function Dashboard() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const [materi, setMateri] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [m, h] = await Promise.all([
                getMateri(),
                getMyHistory()
            ]);
            setMateri(m);
            setHistory(h);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const totalRelevan = history.filter(
        (h) => h.status !== "Tidak Relevan"
    ).length;

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="fw-bold">
                Halo, {user?.nama || "Siswa"} 👋
            </h2>
            <p className="text-muted mb-4">
                Selamat belajar di AILA Learning System
            </p>

            {/* STAT CARDS */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-primary">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted">
                                    Total Materi
                                </small>
                                <h3 className="fw-bold mt-1">
                                    {materi.length}
                                </h3>
                            </div>
                            <FaBook
                                size={35}
                                className="text-primary"
                                style={{ opacity: 0.4 }}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-success">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted">
                                    Total Pertanyaan
                                </small>
                                <h3 className="fw-bold mt-1">
                                    {history.length}
                                </h3>
                            </div>
                            <FaRobot
                                size={35}
                                className="text-success"
                                style={{ opacity: 0.4 }}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm border-start border-4 border-warning">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <small className="text-muted">
                                    Pertanyaan Relevan
                                </small>
                                <h3 className="fw-bold mt-1">
                                    {totalRelevan}
                                </h3>
                            </div>
                            <FaCheckCircle
                                size={35}
                                className="text-warning"
                                style={{ opacity: 0.4 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* MATERI TERSEDIA */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header d-flex justify-content-between">
                            <span className="fw-bold">
                                📚 Materi Tersedia
                            </span>
                            <Link
                                to="/siswa/materi"
                                className="btn btn-sm btn-outline-primary"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <ul className="list-group list-group-flush">
                            {materi.slice(0, 5).map((item) => (
                                <li
                                    key={item.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    <span>
                                        <FaBook
                                            className="text-primary me-2"
                                        />
                                        {item.judul}
                                    </span>
                                    <Link
                                        to="/siswa/chatbot"
                                        className="btn btn-sm btn-primary"
                                    >
                                        Tanya
                                    </Link>
                                </li>
                            ))}
                            {materi.length === 0 && (
                                <li className="list-group-item text-muted text-center py-3">
                                    Belum ada materi tersedia.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* RIWAYAT TERAKHIR */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header d-flex justify-content-between">
                            <span className="fw-bold">
                                🕐 Riwayat Terakhir
                            </span>
                            <Link
                                to="/siswa/history"
                                className="btn btn-sm btn-outline-secondary"
                            >
                                Lihat Semua
                            </Link>
                        </div>
                        <ul className="list-group list-group-flush">
                            {history.slice(0, 5).map((item) => (
                                <li
                                    key={item.id}
                                    className="list-group-item"
                                >
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">
                                            {item.materi}
                                        </small>
                                        <span
                                            className={`badge ${
                                                item.status === "Tidak Relevan"
                                                    ? "bg-danger"
                                                    : "bg-success"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="mb-0 mt-1">
                                        {item.pertanyaan}
                                    </p>
                                    <small className="text-muted">
                                        {item.created_at}
                                    </small>
                                </li>
                            ))}
                            {history.length === 0 && (
                                <li className="list-group-item text-muted text-center py-3">
                                    Belum ada riwayat chat.
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;