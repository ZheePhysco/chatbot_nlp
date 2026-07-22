import { useEffect, useState } from "react";
import CardStat from "../../components/common/CardStat";
import {
    FaBook,
    FaRobot,
    FaUsers,
    FaUpload
} from "react-icons/fa";
import { getDashboardGuru } from "../../services/dashboardService";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        jumlah_materi: 0,
        jumlah_chat: 0,
        jumlah_siswa: 0,
        upload_hari_ini: 0,
        aktivitas: [],
        materi_terbaru: []
    });

    const loadDashboard = async () => {
        try {
            const data = await getDashboardGuru();
            setDashboard(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    return (
        <div>
            <h2 className="fw-bold">
                Dashboard Guru
            </h2>
            <p className="text-muted">
                Selamat datang di AILA Learning System
            </p>
            <div className="row mt-4">
                <CardStat
                    title="Jumlah Materi"
                    value={dashboard.jumlah_materi}
                    color="primary"
                    icon={<FaBook />}
                />
                <CardStat
                    title="Total Chat"
                    value={dashboard.jumlah_chat}
                    color="success"
                    icon={<FaRobot />}
                />
                <CardStat
                    title="Jumlah Siswa"
                    value={dashboard.jumlah_siswa}
                    color="warning"
                    icon={<FaUsers />}
                />
                <CardStat
                    title="Upload Hari Ini"
                    value={dashboard.upload_hari_ini}
                    color="danger"
                    icon={<FaUpload />}
                />
            </div>
            <div className="row mt-3">
                <div className="col-lg-7">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            Aktivitas Terbaru
                        </div>
                        <div className="card-body">
                            <ul>
                                {
                                    dashboard.aktivitas.map(
                                        (item, index) => (
                                            <li key={index}>
                                                {item.judul}
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            Materi Terbaru
                        </div>
                        <div className="card-body">
                            <ul>
                                {
                                    dashboard.materi_terbaru.map(
                                        (item, index) => (
                                            <li key={index}>
                                                {item.judul}
                                            </li>
                                        )
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;