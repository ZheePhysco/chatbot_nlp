function Profile() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <div className="container-fluid">
            <h3 className="fw-bold mb-4">
                Profil Saya
            </h3>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center p-5">
                            <div
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto mb-4"
                                style={{
                                    width: "120px",
                                    height: "120px"
                                }}
                            >
                                <span
                                    className="text-white fw-bold"
                                    style={{ fontSize: "50px" }}
                                >
                                    {user?.nama?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h4 className="fw-bold mb-1">
                                {user?.nama}
                            </h4>
                            <span className="badge bg-primary px-3 py-2 mb-4">
                                {user?.role?.toUpperCase()}
                            </span>
                            <div className="card bg-light border-0 text-start mt-3">
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-4 text-muted">
                                            Nama
                                        </div>
                                        <div className="col-8 fw-semibold">
                                            {user?.nama}
                                        </div>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="row mb-3">
                                        <div className="col-4 text-muted">
                                            Email
                                        </div>
                                        <div className="col-8 fw-semibold">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="row">
                                        <div className="col-4 text-muted">
                                            Role
                                        </div>
                                        <div className="col-8">
                                            <span className="badge bg-primary">
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;