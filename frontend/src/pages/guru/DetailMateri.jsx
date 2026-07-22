import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDetailMateri } from "../../services/materiService";

function DetailMateri() {
    const { id } = useParams();
    const [materi, setMateri] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDetail();
    }, []);

    const loadDetail = async () => {
        try {
            const data = await getDetailMateri(id);
            setMateri(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="text-center py-5">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />
                    <p className="mt-3">Memuat materi...</p>
                </div>
            </div>
        );
    }

    if (!materi) {
        return (
            <div className="container-fluid">
                <div className="alert alert-danger">
                    Materi tidak ditemukan.
                </div>
                <Link
                    to="/guru/materi"
                    className="btn btn-secondary"
                >
                    Kembali
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold">
                        {materi.judul}
                    </h3>
                    <p className="text-muted mb-0">
                        File : {materi.nama_file}
                    </p>
                </div>
                <Link
                    to="/guru/materi"
                    className="btn btn-secondary"
                >
                    Kembali
                </Link>
            </div>
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <iframe
                        title="Preview Materi"
                        src={`http://127.0.0.1:5000/uploads/${materi.nama_file}`}
                        width="100%"
                        height="700"
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default DetailMateri;