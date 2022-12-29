import { Dropdown, Modal, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ACCESS_TOKEN, API_URL } from "../constants";

export default function Home() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const getUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: localStorage.getItem(ACCESS_TOKEN) },
      });
      setUsers(res.data.data);
    } catch (error) {}
  };

  const onBtnDelete = (item) => {
    setSelectedUser(item);
    setIsModalOpen(true);
  };

  const onDelete = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: localStorage.getItem(ACCESS_TOKEN) },
      });

      getUsers();
      setLoading(false);
      setIsModalOpen(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getItems = (item) => {
    let menuItem = [
      {
        key: "1",
        label: (
          <button
            className="btn btn-link"
            onClick={() => navigate(`/details/${item.id}`)}
          >
            Details
          </button>
        ),
      },
    ];

    if (user?.role?.toUpperCase() === "ADMIN") {
      menuItem.push({
        key: "2",
        label: (
          <button
            className="btn btn-link text-danger"
            onClick={() => onBtnDelete(item)}
          >
            Delete
          </button>
        ),
      });
    }

    return menuItem;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <strong
            style={{ cursor: "pointer" }}
            className="text-primary"
            onClick={() => navigate(`/details/${record?.id}`)}
          >
            {record?.name}
          </strong>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "",
      key: "action",
      render: (_, item) => {
        return (
          <Dropdown
            menu={{ items: getItems(item) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <a href="" onClick={(e) => e.preventDefault()}>
              <Space>Action</Space>
            </a>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between pb-3">
        <h5>User list</h5>

        {user?.role?.toUpperCase() === "ADMIN" && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/add-user")}
          >
            Add User
          </button>
        )}
      </div>

      <Table rowKey={(item) => item.id} dataSource={users} columns={columns} />

      <Modal
        title="Delete User"
        open={isModalOpen}
        okText={isLoading ? "Deleting..." : "Delete"}
        okType="danger"
        okButtonProps={{ disabled: isLoading }}
        onOk={() => onDelete(selectedUser?.id)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Are you sure to delete {selectedUser?.name}</p>
      </Modal>
    </div>
  );
}
