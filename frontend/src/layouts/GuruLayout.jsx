import { Outlet } from "react-router-dom";
import SidebarGuru from "../components/layout/SidebarGuru";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function GuruLayout() {
    return (
        <div className="d-flex">
            <SidebarGuru />
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#F8FAFC"
                }}
            >
                <Header />
                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default GuruLayout;