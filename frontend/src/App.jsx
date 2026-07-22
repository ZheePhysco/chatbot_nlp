import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// LOGIN
import Login from "./pages/auth/Login";

// LAYOUT
import GuruLayout from "./layouts/GuruLayout";
import SiswaLayout from "./layouts/SiswaLayout";

// GURU
import DashboardGuru from "./pages/guru/Dashboard";
import MateriGuru from "./pages/guru/Materi";
import DetailMateri from "./pages/guru/DetailMateri";
import UploadMateri from "./pages/guru/UploadMateri";
import ChatbotGuru from "./pages/guru/Chatbot";
import ChatbotGemini from "./pages/guru/ChatbotGemini";
import HistoryGuru from "./pages/guru/History";
import ProfileGuru from "./pages/guru/Profile";

// SISWA
import DashboardSiswa from "./pages/siswa/Dashboard";
import MateriSiswa from "./pages/siswa/Materi";
import ChatbotSiswa from "./pages/siswa/Chatbot";
import HistorySiswa from "./pages/siswa/History";
import ProfileSiswa from "./pages/siswa/Profile";

// ERROR
import NotFound from "./pages/NotFound";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LOGIN */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* GURU */}
                <Route
                    path="/guru"
                    element={<GuruLayout />}
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />
                    <Route
                        path="dashboard"
                        element={<DashboardGuru />}
                    />
                    <Route
                        path="materi"
                        element={<MateriGuru />}
                    />
                    <Route
                        path="materi/:id"
                        element={<DetailMateri />}
                    />
                    <Route
                        path="upload"
                        element={<UploadMateri />}
                    />
                    <Route
                        path="chatbot"
                        element={<ChatbotGuru />}
                    />
                    <Route
                        path="chatbot-gemini"
                        element={<ChatbotGemini />}
                    />
                    <Route
                        path="history"
                        element={<HistoryGuru />}
                    />
                    <Route
                        path="profile"
                        element={<ProfileGuru />}
                    />
                </Route>

                {/* SISWA */}
                <Route
                    path="/siswa"
                    element={<SiswaLayout />}
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="dashboard"
                                replace
                            />
                        }
                    />
                    <Route
                        path="dashboard"
                        element={<DashboardSiswa />}
                    />
                    <Route
                        path="materi"
                        element={<MateriSiswa />}
                    />
                    <Route
                        path="chatbot"
                        element={<ChatbotSiswa />}
                    />
                    <Route
                        path="history"
                        element={<HistorySiswa />}
                    />
                    <Route
                        path="profile"
                        element={<ProfileSiswa />}
                    />
                </Route>

                {/* 404 */}
                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;