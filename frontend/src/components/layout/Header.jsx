import { FaBell, FaUserCircle } from "react-icons/fa";

function Header() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <header
            className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
        >
            <div>
                <h4
                    className="mb-0 fw-bold"
                    style={{ color: "#1E293B" }}
                >
                    AILA Learning System
                </h4>
                <small className="text-muted">
                    Media Pembelajaran Berbasis AI
                </small>
            </div>
            <div className="d-flex align-items-center">
                <FaBell
                    size={20}
                    className="me-4 text-secondary"
                />
                <FaUserCircle
                    size={38}
                    className="text-primary me-2"
                />
                <div>
                    <strong>
                        {user?.nama || "User"}
                    </strong>
                    <br />
                    <small className="text-muted">
                        {user?.role || "-"}
                    </small>
                </div>
            </div>
        </header>
    );
}

export default Header;