function CardStat({ title, value, color = "primary", icon }) {
    return (
        <div className="col-md-3 mb-4">
            <div className={`card border-0 shadow-sm border-start border-4 border-${color}`}>
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <div>
                            <small className="text-muted">
                                {title}
                            </small>
                            <h3 className="fw-bold mt-2">
                                {value}
                            </h3>
                        </div>
                        <div
                            style={{
                                fontSize: "35px",
                                opacity: .4
                            }}
                        >
                            {icon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardStat;