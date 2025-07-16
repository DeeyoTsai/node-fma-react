import axios from "axios";
const API_URL = "http://localhost:8080/api/fmatable";

class FmaService {
  query(employee, lot, line, product, sdate, edate) {
    // console.log(employee, dt, line, product);
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }

    return axios.get(
      API_URL + `/${employee}_${lot}_${line}_${product}_${sdate}_${edate}`,
      {
        headers: { Authorization: token },
      }
    );
  }
  queryByOutlineId(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    // console.log(id);
    return axios.get(API_URL + `/glassDataSet/${id}`, {
      headers: { Authorization: token },
    });
  }
  addOutline(outlineData) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/fmaOutline",
      {
        outlineData,
      },
      {
        headers: { Authorization: token },
      }
    );
  }
  deleteOutlineRow(id) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    console.log(`/fmaOutlineRow/${id}`);
    return axios.delete(API_URL + `/fmaOutlineRow/${id}`, {
      headers: { Authorization: token },
    });
  }
  addGlasses(employee, sheetDataSet) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/glassDataSet",
      { employee, sheetDataSet },
      {
        headers: { Authorization: token },
      }
    );
  }
}

export default new FmaService();
