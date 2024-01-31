import React, { useState } from "react";
import ImnLogo from "../assets/images/logo.svg";
import { userService } from "../services";
import { Redirect, useHistory } from "react-router-dom";

function Signin() {
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [toggle, setToggle] = useState(true);
  const [error, setError] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const handleSubmitEmail = () => {
    userService.login(emailId).then((result) => {
      if (result.status == 200) {
        setToggle(false);
        setError("");
      } else {
        result.common && setError(result.common[0]);
        result.email && setError(result.email[0]);
      }
    });
  };
  const handleSubmitOtp = () => {
    userService.verifyOtp(otp).then((result) => {
      if (result.status == 200) {
        localStorage.setItem("user", JSON.stringify(result));
        if (result.data.user_role === "Admin") {
          history.push("/admin/dashboard");
        }
        if (result.data.user_role === "Employee") {
          history.push("/employee/dashboard");
        }
        setError("");
        setOtp("");
      } else {
        result?.message && setError(result?.message);
        result.data.errors.otp && setError(result.data.errors.otp[0]);
      }
    });
  };
  const backButton = () => {
    setToggle(true);
    setError("");
    setOtp("");
  };
  if (user && user.data.user_role === "Admin") {
    return <Redirect to="/admin/dashboard" />;
  } else if (user && user.data.user_role === "Employee") {
    return <Redirect to="/employee/dashboard" />;
  }
  return (
    <div className="fw border">
      <div className="fw__left"></div>
      <div className="fw__right">
        <div className="text-center">
          <ImnLogo width="150" />
          <h4 className="mt-5">Login</h4>
        </div>
        {toggle ? (
          <>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
              />
              <span className="text-danger">{error}</span>
            </div>
            <button
              className="btn btn-primary btn-block mt-5"
              onClick={handleSubmitEmail}
            >
              Get OTP
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1" className="text-success">
                An OTP has been sent to your email.
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <span className="text-danger">{error}</span>
            </div>
            <button className="btn  mt-3" onClick={backButton}>
              Back
            </button>
            <button
              className="btn btn-primary ml-2 mt-3"
              onClick={handleSubmitOtp}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Signin;
