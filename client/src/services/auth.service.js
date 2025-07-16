// 負責處理登入或登出的服務器
import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

class AuthService {
  login(employee, password) {
    return axios.post(API_URL + "/login", {
      employee,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  async register(department, employee, username, password, email) {
    return await axios.post(API_URL + "/createUser", {
      department,
      employee,
      username,
      password,
      email,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
