import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import userImage from "./images/user.png";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  let [employee, setEmplyee] = useState("");
  let [password, setPassword] = useState("");
  let [message, setMessage] = useState("");

  const handleEmployee = (e) => {
    setEmplyee(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleLogin = async () => {
    try {
      let response = await AuthService.login(employee, password);
      // console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));
      window.alert("登入成功!!您現在將被導向個人頁面");
      setCurrentUser(AuthService.getCurrentUser());
      navigate("/profile");
    } catch (e) {
      console.log(e);
      setMessage(e.response.data.msg);
    }
  };

  return (
    <div style={{ padding: "3rem" }} className="col-md-12">
      <div>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div
                className="card shadow-2-strong"
                style={{ borderRadius: "1rem" }}
              >
                <div className="card-body p-5 text-center">
                  <img
                    src={userImage}
                    alt="User icon"
                    width={"200px"}
                    // style={{ width: "500px", height: "600px" }}
                  />
                  <h3 className="mb-5">Sign in</h3>
                  <form action="">
                    <div className="form-group form-outline mb-4 d-flex justify-content-center align-items-center">
                      <label htmlFor="employee" style={{ width: "3.5rem" }}>
                        工號：
                      </label>
                      <input
                        onChange={handleEmployee}
                        type="text"
                        className="form-control form-control-lg"
                        name="employee"
                      />
                    </div>
                    <div className="form-group mb-4 d-flex justify-content-center align-items-center">
                      <label htmlFor="password" style={{ width: "3.5rem" }}>
                        密碼：
                      </label>
                      <input
                        onChange={handlePassword}
                        type="password"
                        className="form-control form-control-lg"
                        name="password"
                        autoComplete="on"
                      />
                    </div>
                  </form>
                  <div className="form-check d-flex justify-content-start mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form1Example3"
                    />
                    <label className="form-check-label" htmlFor="form1Example3">
                      {" "}
                      Remember password{" "}
                    </label>
                  </div>

                  <button
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-lg btn-block"
                    type="submit"
                    onClick={handleLogin}
                  >
                    登入系統
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    // <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
    //   <div className="container py-5 h-100">
    //     <div class="row d-flex justify-content-center align-items-center h-100">
    //       <div class="col-12 col-md-8 col-lg-6 col-xl-5">
    //         <div class="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
    //           <div class="card-body p-5 text-center">
    //             <h3 class="mb-5">Sign in</h3>

    //             <div data-mdb-input-init class="form-outline mb-4">
    //               <input
    //                 type="email"
    //                 id="typeEmailX-2"
    //                 class="form-control form-control-lg"
    //               />
    //               <label class="form-label" for="typeEmailX-2">
    //                 Email
    //               </label>
    //             </div>

    //             <div data-mdb-input-init class="form-outline mb-4">
    //               <input
    //                 type="password"
    //                 id="typePasswordX-2"
    //                 class="form-control form-control-lg"
    //               />
    //               <label class="form-label" for="typePasswordX-2">
    //                 Password
    //               </label>
    //             </div>

    //             {/* <!-- Checkbox --> */}
    //             <div class="form-check d-flex justify-content-start mb-4">
    //               <input
    //                 class="form-check-input"
    //                 type="checkbox"
    //                 value=""
    //                 id="form1Example3"
    //               />
    //               <label class="form-check-label" for="form1Example3">
    //                 {" "}
    //                 Remember password{" "}
    //               </label>
    //             </div>

    //             <button
    //               data-mdb-button-init
    //               data-mdb-ripple-init
    //               class="btn btn-primary btn-lg btn-block"
    //               type="submit"
    //             >
    //               Login
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export default LoginComponent;
