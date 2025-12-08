import React from "react";

const OrderTracking = ({ tracking }) => {
  if (!tracking || !tracking.timeline) {
    return <p className="text-muted">Tracking info not available.</p>;
  }

  const steps = tracking.timeline;

  return (
    <div className="tracking-container mt-4 p-4 border rounded shadow-sm">
      <h5 className="fw-bold mb-3">Order Tracking</h5>

      {steps.map((step, index) => {
        const label = step.stage; // backend stage
        const completed = step.completed; // backend completed flag

        return (
          <div key={index} className="d-flex align-items-start mb-4">

            {/* LEFT: Dots + Lines */}
            <div className="text-center" style={{ width: "40px" }}>
              <div
                style={{
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  backgroundColor: completed ? "#28a745" : "#c4c4c4",
                  margin: "auto",
                }}
              ></div>

              {/* Vertical Line (skip for last item) */}
              {index !== steps.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    height: "35px",
                    backgroundColor: completed ? "#28a745" : "#c4c4c4",
                    margin: "5px auto 0",
                  }}
                ></div>
              )}
            </div>

            {/* RIGHT: Text */}
            <div>
              <h6
                className={completed ? "fw-bold text-success" : "fw-bold"}
                style={{ textTransform: "capitalize" }}
              >
                {label.replace(/_/g, " ")}
              </h6>

              {/* Optional timestamp (your backend doesn't send one) */}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default OrderTracking;
