import { useEffect, useRef, useState } from "react";
import {
    getProfile,
    updateProfile,
    gantiPassword,
    uploadFoto
} from "../../services/profileService";
import {
    FaCamera,
    FaEdit,
    FaSave,
    FaLock,
    FaUserCircle
} from "react-icons/fa";
import Swal from "sweetalert2";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [nama, setNama] = useState("");
    const [bio, setBio] = useState("");
    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");
    const [konfirmasi, setKonfirmasi] = useState("");
    const [savingBio, setSavingBio] = useState(false);
    const [savingPass, setSavingPass] = useState(false);
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const fotoRef = useRef(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            setNama(data.nama);
            setBio(data.bio || "");

            const user = JSON.parse(
                localStorage.getItem("user")
            );
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    nama: data.nama,
                    foto: data.foto
                })
            );
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBio = async () => {
        try {
            setSavingBio(true);
            await updateProfile({ nama, bio });

            const user = JSON.parse(
                localStorage.getItem("user")
            );
            localStorage.setItem(
                "user",
                JSON.stringify({ ...user, nama })
            );

            setProfile((prev) => ({
                ...prev,
                nama,
                bio
            }));
            setEditMode(false);
            Swal.fire(
                "Berhasil",
                "Profil berhasil diupdate.",
                "success"
            );
        } catch (e) {
            Swal.fire(
                "Gagal",
                e.response?.data?.message || "Terjadi kesalahan.",
                "error"
            );
        } finally {
            setSavingBio(false);
        }
    };

    const handleGantiPassword = async (e) => {
        e.preventDefault();
        if (passwordBaru !== konfirmasi) {
            Swal.fire(
                "Peringatan",
                "Konfirmasi password tidak cocok.",
                "warning"
            );
            return;
        }
        try {
            setSavingPass(true);
            await gantiPassword({
                password_lama: passwordLama,
                password_baru: passwordBaru
            });
            Swal.fire(
                "Berhasil",
                "Password berhasil diubah.",
                "success"
            );
            setPasswordLama("");
            setPasswordBaru("");
            setKonfirmasi("");
        } catch (e) {
            Swal.fire(
                "Gagal",
                e.response?.data?.message || "Terjadi kesalahan.",
                "error"
            );
        } finally {
            setSavingPass(false);
        }
    };

    const handleUploadFoto = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingFoto(true);
            const formData = new FormData();
            formData.append("foto", file);
            const result = await uploadFoto(formData);

            setProfile((prev) => ({
                ...prev,
                foto: result.foto
            }));

            const user = JSON.parse(
                localStorage.getItem("user")
            );
            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,
                    foto: result.foto
                })
            );

            Swal.fire(
                "Berhasil",
                "Foto profil berhasil diupdate.",
                "success"
            );
        } catch (e) {
            Swal.fire(
                "Gagal",
                e.response?.data?.message || "Terjadi kesalahan.",
                "error"
            );
        } finally {
            setUploadingFoto(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h3 className="fw-bold mb-4">
                Profil Saya
            </h3>
            <div className="row justify-content-center g-4">

                {/* KARTU PROFIL */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 text-center">
                        <div className="card-body p-4">

                            {/* FOTO */}
                            <div
                                className="position-relative d-inline-block mb-3"
                            >
                                {profile?.foto ? (
                                    <img
                                        src={profile.foto}
                                        alt="Foto Profil"
                                        className="rounded-circle"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",
                                            border: "4px solid #0d6efd"
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto"
                                        style={{
                                            width: "120px",
                                            height: "120px"
                                        }}
                                    >
                                        <span
                                            className="text-white fw-bold"
                                            style={{ fontSize: "50px" }}
                                        >
                                            {profile?.nama
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <button
                                    className="btn btn-primary btn-sm rounded-circle position-absolute bottom-0 end-0"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        padding: "0"
                                    }}
                                    onClick={() =>
                                        fotoRef.current.click()
                                    }
                                    disabled={uploadingFoto}
                                >
                                    {uploadingFoto ? (
                                        <div
                                            className="spinner-border spinner-border-sm text-white"
                                            style={{
                                                width: "14px",
                                                height: "14px"
                                            }}
                                        />
                                    ) : (
                                        <FaCamera size={14} />
                                    )}
                                </button>
                                <input
                                    ref={fotoRef}
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleUploadFoto}
                                />
                            </div>

                            <h4 className="fw-bold mb-1">
                                {profile?.nama}
                            </h4>
                            <span className="badge bg-primary px-3 py-2 mb-3">
                                {profile?.role?.toUpperCase()}
                            </span>
                            <p className="text-muted small">
                                {profile?.bio || "Belum ada bio."}
                            </p>
                            <hr />
                            <div className="text-start">
                                <p className="mb-2">
                                    <strong>Email:</strong>
                                    <br />
                                    <span className="text-muted">
                                        {profile?.email}
                                    </span>
                                </p>
                                <p className="mb-0">
                                    <strong>Role:</strong>
                                    <br />
                                    <span className="text-muted">
                                        {profile?.role}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FORM EDIT */}
                <div className="col-md-6">

                    {/* EDIT BIODATA */}
                    <div className="card shadow-sm border-0 mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-white">
                            <span className="fw-bold">
                                <FaEdit className="me-2 text-primary" />
                                Edit Biodata
                            </span>
                            {!editMode && (
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() =>
                                        setEditMode(true)
                                    }
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Nama Lengkap
                                </label>
                                <input
                                    className="form-control"
                                    value={nama}
                                    onChange={(e) =>
                                        setNama(e.target.value)
                                    }
                                    disabled={!editMode}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Email
                                </label>
                                <input
                                    className="form-control"
                                    value={profile?.email}
                                    disabled
                                />
                                <small className="text-muted">
                                    Email tidak dapat diubah.
                                </small>
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Bio
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={bio}
                                    onChange={(e) =>
                                        setBio(e.target.value)
                                    }
                                    disabled={!editMode}
                                    placeholder="Tulis sesuatu tentang dirimu..."
                                />
                            </div>
                            {editMode && (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveBio}
                                        disabled={savingBio}
                                    >
                                        <FaSave className="me-2" />
                                        {savingBio
                                            ? "Menyimpan..."
                                            : "Simpan"}
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditMode(false);
                                            setNama(profile.nama);
                                            setBio(profile.bio || "");
                                        }}
                                    >
                                        Batal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GANTI PASSWORD */}
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white">
                            <span className="fw-bold">
                                <FaLock className="me-2 text-danger" />
                                Ganti Password
                            </span>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleGantiPassword}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Password Lama
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordLama}
                                        onChange={(e) =>
                                            setPasswordLama(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Masukkan password lama"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={passwordBaru}
                                        onChange={(e) =>
                                            setPasswordBaru(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Masukkan password baru"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        Konfirmasi Password Baru
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={konfirmasi}
                                        onChange={(e) =>
                                            setKonfirmasi(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ulangi password baru"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    disabled={savingPass}
                                >
                                    <FaLock className="me-2" />
                                    {savingPass
                                        ? "Menyimpan..."
                                        : "Ganti Password"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;