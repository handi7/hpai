import React, { useState } from "react";
import "../styles/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { ACCESS_TOKEN, API_URL } from "../constants";
import { Navigate } from "react-router";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();

  const [form, setForm] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onFinish = async (e, formData) => {
    try {
      e.preventDefault();
      setLoading(true);
      setErrMsg("");
      const res = await axios.post(`${API_URL}/api/login`, formData);
      localStorage.setItem(ACCESS_TOKEN, res.data.token);
      dispatch({ type: "AUTHENTICATED", payload: res.data.data });
      setLoading(false);
    } catch (error) {
      if (error?.response.status === 404 || 401) {
        setErrMsg(error.response.data.errors);
      }
      setLoading(false);
    }
  };

  const toggle = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (localStorage.getItem(ACCESS_TOKEN)) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="wrapper d-flex justify-content-center align-items-center bg-secondary">
      <div className="d-grid gap-3 login bg-light p-4">
        <h2 className="text-secondary">Login</h2>
        {errMsg && (
          <div className="alert alert-danger">
            <span>{errMsg}</span>
          </div>
        )}

        <form
          className="d-grid gap-3 needs-validation"
          onSubmit={(e) => onFinish(e, form)}
        >
          <div className={`form-group ${form?.email && "was-validated"}`}>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className=" form-control"
              id="email"
              name="email"
              value={form?.email || ""}
              placeholder="Enter Your Email"
              onChange={inputHandler}
              required
            />
            <div className="invalid-feedback">Please Enter Valid Email.</div>
          </div>

          <div className={`form-group ${form?.password && "was-validated"}`}>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <input
                type={showPass ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                value={form?.password || ""}
                placeholder="Enter Your Password"
                onChange={inputHandler}
                required
              />
              <button className="btn bg-secondary text-light">
                {showPass ? (
                  <FaEye onClick={toggle} />
                ) : (
                  <FaEyeSlash onClick={toggle} />
                )}
              </button>
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="btn btn-primary block"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
