import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
import { useAuth } from "../context/auth";
import "../Style/AdminPanel.css";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CarryOutOutlined,
  FormOutlined,
  HomeOutlined,
  WarningOutlined,
  TruckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

import Users from "./Users";
import Category from "./Category";
import Blogs from "./Blogs";
import BestJob from "./BestJob";
import FeatureJob from "./FeatureJob";
import RecentJob from "./RecentJob";
import Tag from "./Tag";
import MasterCards from "./MasterCards";

import { Profile } from "./Profile";
// import logo from "../../public/logo.png";
// properties-details

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const auth1 = JSON.parse(localStorage.getItem('auth'));
  

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "users":
        return <Users />;

        case "categories":
        return <Category />;



        case "blogs":
        return <Blogs />;

        case "tag":
        return <Tag />;

        case "bestjob":
        return <BestJob />;

        case "feature-job":
        return <FeatureJob />;

        case "recent-job":
        return <RecentJob />;


        
        case "profile":
        return <Profile  setSelectedTab={setSelectedTab}/>;


         case "master-card":
        return <MasterCards setSelectedTab={setSelectedTab} />;
      // BlogList
    }
  };

  const menuItems = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
     { key: "profile", icon: <HomeOutlined />, label: "Profile" },
    { key: "users", icon: < UserOutlined/>, label: "Admin" },
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
    { key: "blogs", icon: <TeamOutlined  />, label: "Blogs" },
    { key: "tag", icon: <TeamOutlined  />, label: "Tag" },

    //  {
    //   key: "master-card",
    //   icon: <TeamOutlined />,
    //   label: "Merchantising",
    // },

  ];
  const menuItems1 = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
     { key: "profile", icon: <HomeOutlined />, label: "Profile" },
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
    { key: "blogs", icon: <TeamOutlined  />, label: "Blogs" },
     { key: "tag", icon: <TeamOutlined  />, label: "Tag" },
   
    //  {
    //   key: "master-card",
    //   icon: <TeamOutlined />,
    //   label: "Merchantising",
    // },

  ];

  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Header className="header">
        <div className="logo-vinMart">
          {/* <img src={logo} alt="dewanRealty Logo" /> */}
          {/* <h1>logo</h1> */}
        </div>

        <Button
          type="primary"
          onClick={handleLogout}
          style={{ marginLeft: "20px" }}
        >
          Logout
        </Button>
      </Header>

      <Layout>
        <Sider className="sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            style={{ height: "100%", borderRight: 0 }}
            onClick={handleMenuClick}
          >
            {/* <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item> */}

{
              auth1?.user?.role==='superAdmin'?(<>
                  {menuItems?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>):(<>
                 
                 {menuItems1?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>)
            }
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content className="content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
