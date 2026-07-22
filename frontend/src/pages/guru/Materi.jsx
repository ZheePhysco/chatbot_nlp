import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMateri } from "../../services/materiService";

function Materi() {
    const [materi, setMateri] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMateri();
    }, []);

    const loadMateri = async () => {
        try {
            const data = await getMateri();
            setMateri(data);
        } catch (error) {
            console.log(error);
        }
    };

    const filteredMateri = materi.filter((item) =>
        item.judul.toLowerCase().includes(
            search.toLowerCase()
        )
    );

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-1">
                        Materi Pembelajaran
                    </h3>
                    <p className="text-muted">
                        Daftar seluruh materi yang telah diunggah.
                    </p>
                </div>
                <Link
                    to="/guru/upload"
                    className="btn btn-primary"
                >
                    + Upload Materi
                </Link>
            </div>
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cari materi..."
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
                                    <th width="60">No</th>
                                    <th>Judul</th>
                                    <th>Nama File</th>
                                    <th width="180">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredMateri.length > 0 ?
                                        filteredMateri.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.judul}</td>
                                                <td>{item.nama_file}</td>
                                                <td>
                                                    <Link
                                                        to={`/guru/materi/${item.id}`}
                                                        className="btn btn-outline-primary btn-sm me-2"
                                                    >
                                                        Lihat
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center py-4"
                                            >
                                                Belum ada materi.
                                            </td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Materi;