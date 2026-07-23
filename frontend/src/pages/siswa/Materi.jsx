import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMateri } from "../../services/materiService";
import { FaBook, FaRobot } from "react-icons/fa";

function Materi() {
    const [materi, setMateri] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMateri();
    }, []);

    const loadMateri = async () => {
        try {
            const data = await getMateri();
            setMateri(data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const filtered = materi.filter((item) =>
        item.judul
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
                Materi Pembelajaran
            </h3>
            <p className="text-muted mb-4">
                Pilih materi untuk mulai belajar
            </p>

            <div className="mb-4">
                <input
                    className="form-control"
                    placeholder="Cari materi..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />
            </div>

            <div className="row">
                {filtered.length > 0 ? (
                    filtered.map((item) => (
                        <div
                            key={item.id}
                            className="col-md-4 mb-4"
                        >
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body">
                                    <div
                                        className="bg-primary bg-opacity-10 rounded p-3 mb-3 text-center"
                                    >
                                        <FaBook
                                            size={40}
                                            className="text-primary"
                                        />
                                    </div>
                                    <h5 className="fw-bold">
                                        {item.judul}
                                    </h5>
                                    <p className="text-muted small">
                                        {item.nama_file}
                                    </p>
                                </div>
                                <div className="card-footer bg-white border-0 d-flex gap-2">
                                    <Link
                                        to={`/siswa/materi/${item.id}`}
                                        className="btn btn-outline-primary btn-sm flex-grow-1"
                                    >
                                        📄 Lihat Materi
                                    </Link>
                                    <Link
                                        to="/siswa/chatbot"
                                        state={{ materiId: item.id }}
                                        className="btn btn-primary btn-sm flex-grow-1"
                                    >
                                        <FaRobot className="me-1" />
                                        Tanya
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <FaBook
                            size={60}
                            className="text-muted mb-3"
                        />
                        <p className="text-muted">
                            Belum ada materi tersedia.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Materi;