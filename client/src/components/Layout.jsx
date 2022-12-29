import React, { useEffect, useState } from "react";
import { Dropdown, Layout, Menu, Space } from "antd";
import { AiOutlineMenu } from "react-icons/ai";
import { menuData } from "./MenuData";
import { ACCESS_TOKEN, API_URL } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

export default function MainLayout({ children }) {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const keepLogin = async (token) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/keep-login`,
        {},
        { headers: { Authorization: token } }
      );

      localStorage.setItem(ACCESS_TOKEN, res.data.token);
      dispatch({ type: "AUTHENTICATED", payload: res.data.data });
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem(ACCESS_TOKEN);
        navigate("/login");
      }
    }
  };

  const onLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      keepLogin(token);
    } else {
      navigate("/login");
    }
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <button className="btn btn-sm text-danger w-100" onClick={onLogout}>
          logout
        </button>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        className="bg-white border"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div
          style={{ cursor: "pointer" }}
          className="text-center text-primary my-3"
          onClick={() => navigate("/")}
        >
          <h2>{collapsed ? "B" : "BRAND"}</h2>
        </div>

        <Menu
          className="bg-white"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={menuData}
        />
      </Sider>

      <Layout className="site-layout">
        <Header className="border-bottom bg-white ps-3">
          <div className="d-flex justify-content-between align-items-center">
            <AiOutlineMenu
              style={{ cursor: "pointer" }}
              size={24}
              onClick={() => setCollapsed(!collapsed)}
            />

            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {`${user?.name}(${user?.role})`}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </Header>

        <Content className="h-100 m-5 p-5 bg-white rounded">{children}</Content>
      </Layout>
    </Layout>
  );
}
