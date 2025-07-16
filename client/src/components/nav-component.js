import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import "./css/nav-component.css";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功!現在您會被導向到登入畫面~");
    setCurrentUser(null);
  };
  return (
    <div>
      <nav>
        <nav
          className="navbar navbar-expand-lg bg-dark border-bottom border-body"
          data-bs-theme="dark"
        >
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    首頁
                  </Link>
                </li>
                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      註冊帳號
                    </Link>
                  </li>
                )}
                {!currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      登入帳號
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link
                      onClick={handleLogout}
                      className="nav-link"
                      to="/login"
                    >
                      登出
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      個人頁面
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/fmaquery">
                      FMA記錄查詢
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/fmatable">
                      FMA填寫表格
                    </Link>
                  </li>
                )}

                {/* <li className="nav-item">
                  <Link className="nav-link" to="/course">
                    課程頁面
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/postCourse">
                    新增課程
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/enroll">
                    註冊課程
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
      </nav>
    </div>
  );
};

export default NavComponent;
