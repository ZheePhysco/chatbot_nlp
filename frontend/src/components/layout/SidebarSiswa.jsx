import {
    FaHome,
    FaBook,
    FaRobot,
    FaHistory,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function SidebarSiswa() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const menus = [
        {
            title: "Dashboard",
            path: "/siswa/dashboard",
            icon: <FaHome />
        },
        {
            title: "Materi",
            path: "/siswa/materi",
            icon: <FaBook />
        },
        {
            title: "Chatbot",
            path: "/siswa/chatbot",
            icon: <FaRobot />
        },
        {
            title: "Riwayat",
            path: "/siswa/history",
            icon: <FaHistory />
        },
        {
            title: "Profil",
            path: "/siswa/profile",
            icon: <FaUser />
        }
    ];

    return (
        <div
            style={{
                width: "260px",
                background: "#1E293B",
                minHeight: "100vh"
            }}
            className="d-flex flex-column"
        >
            <div className="text-center py-4 text-white border-bottom">
                <h3 className="fw-bold">
                    📘 AILA
                </h3>
                <small>
                    Learning System
                </small>
            </div>
            <div className="flex-grow-1 mt-3">
                {
                    menus.map((menu) => (
                        <NavLink
                            key={menu.path}
                            to={menu.path}
                            className={({ isActive }) =>
                                `d-flex align-items-center px-4 py-3 text-decoration-none ${
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-light"
                                }`
                            }
                        >
                            <span className="me-3">
                                {menu.icon}
                            </span>
                            {menu.title}
                        </NavLink>
                    ))
                }
            </div>
            <div className="p-3">
                <button
                    className="btn btn-outline-light w-100"
                    onClick={logout}
                >
                    <FaSignOutAlt className="me-2" />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default SidebarSiswa;