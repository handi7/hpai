import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, API_URL } from "../constants";

export default function AddUser() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({});
  const [show, setShow] = useState({ password: false, repeat: false });
  const [isLoading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const onFinish = async (e, formData) => {
    try {
      e.preventDefault();
      setLoading(true);
      setErrMsg("");
      await axios.post(`${API_URL}/api/users`, formData, {
        headers: { Authorization: localStorage.getItem(ACCESS_TOKEN) },
      });
      setLoading(false);
      navigate(-1);
    } catch (error) {
      if (error.response.status === 409) {
        setErrMsg("Email Already Registered.");
      }
      setLoading(false);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggle = (e, type) => {
    e.preventDefault();
    setShow({ ...show, [type]: !show[type] });
  };

  useEffect(() => {
    if (user?.role) {
      if (user?.role?.toUpperCase() !== "ADMIN") {
        navigate("/");
      }
    }
  }, [user]);

  return (
    <div>
      <div className="d-flex justify-content-between mb-5">
        <h5>Add New User</h5>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft /> Back
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <div style={{ width: 480 }}>
          {errMsg && (
            <div className="alert alert-danger">
              <span>{errMsg}</span>
            </div>
          )}

          <div className="card bg-primary p-5 text-white">
            <form
              className="d-grid gap-3 needs-validation"
              onSubmit={(e) => onFinish(e, form)}
            >
              <div className={`form-group ${form?.email && "was-validated"}`}>
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className=" form-control"
                  id="name"
                  name="name"
                  value={form?.name || ""}
                  placeholder="Enter Name"
                  onChange={inputHandler}
                  required
                />
                <div className="invalid-feedback">Please Enter Name.</div>
              </div>

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
                  placeholder="Enter Email"
                  onChange={inputHandler}
                  required
                />
                <div className="invalid-feedback">
                  Please Enter Valid Email.
                </div>
              </div>

              <div className={`form-group ${form?.role && "was-validated"}`}>
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  className=" form-control"
                  id="role"
                  name="role"
                  value={form?.role || ""}
                  onChange={inputHandler}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <div className="invalid-feedback">Please Select Role.</div>
              </div>

              <div
                className={`form-group ${form?.password && "was-validated"}`}
              >
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={show?.password ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    value={form?.password || ""}
                    placeholder="Enter Your Password"
                    onChange={inputHandler}
                    required
                  />
                  <button className="btn bg-light text-primary rounded-end">
                    {show?.password ? (
                      <FaEye onClick={(e) => toggle(e, "password")} />
                    ) : (
                      <FaEyeSlash onClick={(e) => toggle(e, "password")} />
                    )}
                  </button>
                  <div className="invalid-feedback">Please Input Password.</div>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-light text-primary"
              >
                {isLoading ? "Loading..." : "Add User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
