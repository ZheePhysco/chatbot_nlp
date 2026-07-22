import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveToken } from "../../services/authService";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submitLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await login(email, password);
            saveToken(data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );
            if (data.role === "guru") {
                navigate("/guru/dashboard");
            } else {
                navigate("/siswa/dashboard");
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Login gagal"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="container-fluid vh-100"
            style={{ background: "#F8FAFC" }}
        >
            <div className="row h-100 justify-content-center align-items-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow border-0">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h2
                                    className="fw-bold"
                                    style={{ color: "#1E293B" }}
                                >
                                    📘 AILA
                                </h2>
                                <p className="text-muted mb-0">
                                    AI Learning System
                                </p>
                                <small className="text-secondary">
                                    Media Pembelajaran Berbasis AI
                                </small>
                            </div>
                            <form onSubmit={submitLogin}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Masukkan Email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Masukkan Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Login"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;