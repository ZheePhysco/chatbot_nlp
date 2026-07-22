import { useState } from "react";
import Swal from "sweetalert2";
import {
    FaCloudUploadAlt,
    FaFilePdf,
    FaFileWord,
    FaFileAlt,
    FaCheckCircle
} from "react-icons/fa";
import { uploadMateri } from "../../services/materiService";
import "./uploadMateri.css";

function UploadMateri() {
    const [judul, setJudul] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasil, setHasil] = useState(null);

    const handleFile = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!judul.trim()) {
            Swal.fire("Peringatan", "Judul materi wajib diisi.", "warning");
            return;
        }
        if (!file) {
            Swal.fire("Peringatan", "Silakan pilih file.", "warning");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("judul", judul);
            formData.append("file", file);
            const response = await uploadMateri(formData);
            setHasil(response);
            Swal.fire("Berhasil", "Materi berhasil diupload.", "success");
            setJudul("");
            setFile(null);
            document.getElementById("fileUpload").value = "";
        } catch (err) {
            Swal.fire(
                "Gagal",
                err?.response?.data?.message || "Upload gagal.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <h3 className="fw-bold mb-4">
                Upload Materi
            </h3>
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Judul Materi
                                    </label>
                                    <input
                                        className="form-control"
                                        value={judul}
                                        onChange={(e) =>
                                            setJudul(e.target.value)
                                        }
                                        placeholder="Contoh : Decision Tree"
                                    />
                                </div>
                                <div className="upload-box">
                                    <FaCloudUploadAlt
                                        size={60}
                                        className="text-primary mb-3"
                                    />
                                    <h5>Pilih File Materi</h5>
                                    <p className="text-muted">
                                        PDF, DOCX atau TXT
                                    </p>
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        className="form-control"
                                        accept=".pdf,.docx,.txt"
                                        onChange={handleFile}
                                    />
                                    {
                                        file && (
                                            <div className="alert alert-success mt-3">
                                                <strong>File dipilih :</strong>
                                                <br />
                                                {file.name}
                                            </div>
                                        )
                                    }
                                </div>
                                <button
                                    className="btn btn-primary mt-4"
                                    disabled={loading}
                                >
                                    {loading ? "Uploading..." : "Upload Materi"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="mb-4">
                                Informasi Upload
                            </h5>
                            <p>
                                <FaFilePdf className="text-danger me-2" />
                                PDF
                            </p>
                            <p>
                                <FaFileWord className="text-primary me-2" />
                                DOCX
                            </p>
                            <p>
                                <FaFileAlt className="text-secondary me-2" />
                                TXT
                            </p>
                            <hr />
                            <p>
                                <FaCheckCircle className="text-success me-2" />
                                Maksimal ukuran 10 MB
                            </p>
                        </div>
                    </div>
                    {
                        hasil && (
                            <div className="card shadow-sm border-0 mt-4">
                                <div className="card-body">
                                    <h5>Upload Berhasil</h5>
                                    <hr />
                                    <p>
                                        <strong>Judul :</strong>
                                        <br />
                                        {hasil.judul}
                                    </p>
                                    <p>
                                        <strong>Jumlah Karakter</strong>
                                        <br />
                                        {hasil.jumlah_karakter}
                                    </p>
                                    <p>
                                        <strong>Jumlah Chunk</strong>
                                        <br />
                                        {hasil.jumlah_chunk}
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default UploadMateri;