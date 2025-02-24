import { message, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => setIsLogoutModalVisible(true),
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => setIsLogoutModalVisible(true),
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        message.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
      setLoading(false); // Set loading to false if no token
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return null; // Render nothing while loading
  }

  if (!user) {
    return null; // Render nothing if user is not set
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-blue-600 p-4 shadow-lg ${
          collapsed ? "w-12" : "w-64"
        } transition-all duration-300 `}
      >
        <div className="justify-between items-center mb-4 hidden sm:flex">
          {!collapsed ? (
            <i
              className="ri-close-line text-white text-2xl cursor-pointer"
              onClick={() => setCollapsed(true)}
            ></i>
          ) : (
            <i
              className="ri-menu-line text-white text-2xl cursor-pointer"
              onClick={() => setCollapsed(false)}
            ></i>
          )}
        </div>

        <div
          className={`mt-16 sm:mt-8 ${
            collapsed && "flex flex-col items-center"
          } text-white`}
        >
          {menu.map((item, index) => (
            <div
              key={crypto.randomUUID()}
              className={`flex  gap-2 p-2 rounded cursor-pointer md:hover:bg-blue-500 transition-colors duration-300 ${
                getIsActiveOrNot(item.paths) ? "bg-blue-500" : ""
              } `}
              onClick={item.onClick}
            >
              {item.icon}
              {!collapsed && (
                <span className="hidden sm:block">{item.title}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 py-4 shadow-lg flex justify-between items-center">
          <h1 className="text-2xl text-white">QUIZ Application</h1>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">{children}</div>
      </div>

      {/* Logout Modal */}
      <Modal
        title="Confirm Logout"
        open={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsLogoutModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsLogoutModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleLogout}>
            Yes, Logout
          </Button>,
        ]}
      >
        <div className="flex flex-col items-center">
          <p className="text-lg">Are you sure you want to logout?</p>
        </div>
      </Modal>
    </div>
  );
}

export default ProtectedRoute;
