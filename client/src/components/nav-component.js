import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import "./css/nav-component.css";

const NavComponent = ({
  currentUser,
  setCurrentUser,
  othersColSpan,
  setOthersColSpan,
  defectArr,
  setDefectArr,
}) => {
  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功!現在您會被導向到登入畫面~");
    setCurrentUser(null);
  };

  const handleClear = () => {
    setDefectArr(defectArr.slice(0, 24));
    setOthersColSpan(5);
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
                <li className="nav-item me-2">
                  <Link className="nav-link" to="/">
                    <h5>首頁</h5>
                  </Link>
                </li>
                {!currentUser && (
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/register">
                      <h5>註冊帳號</h5>
                    </Link>
                  </li>
                )}
                {!currentUser && (
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/login">
                      <h5>登入帳號</h5>
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item me-2">
                    <Link
                      onClick={handleLogout}
                      className="nav-link"
                      to="/login"
                    >
                      <h5>登出</h5>
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/profile">
                      <h5>個人頁面</h5>
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item me-2">
                    <Link className="nav-link" to="/fmaquery">
                      <h5>FMA記錄查詢</h5>
                    </Link>
                  </li>
                )}
                {currentUser && (
                  <li className="nav-item me-2">
                    <Link
                      className="nav-link"
                      to="/fmatable"
                      onClick={handleClear}
                    >
                      <h5>FMA填寫表格</h5>
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
