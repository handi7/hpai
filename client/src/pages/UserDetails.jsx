import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useNavigate, useParams } from "react-router";
import { ACCESS_TOKEN, API_URL } from "../constants";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const getUserDetails = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: localStorage.getItem(ACCESS_TOKEN) },
      });
      setUser(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    if (id) {
      getUserDetails(id);
    }
  }, [id]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h5>
          User/<span className="text-primary">{user?.name}</span>
        </h5>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          <AiOutlineArrowLeft /> Back
        </button>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <div style={{ width: 500 }} className="card bg-primary p-5 pb-5">
          <div className="row text-white mb-5">
            <div className="col">
              <div>
                <strong>Name</strong>
              </div>
              <div>
                <strong>Email</strong>
              </div>
              <div>
                <strong>Role</strong>
              </div>
            </div>
            <div className="col">
              <div>
                : <span>{user?.name}</span>
              </div>
              <div>
                : <span>{user?.email}</span>
              </div>
              <div>
                : <span>{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
