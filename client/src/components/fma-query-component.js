import React, { useState, useEffect } from "react";
import FmaService from "../services/fma.service";
import { useNavigate } from "react-router-dom";
import fmaService from "../services/fma.service";
import { useLocation } from "react-router-dom";

const FmaQueryComponent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const currentDate = new Date().toISOString().split("T")[0];

  let [employee, setEmployee] = useState("");
  let [lot, setLot] = useState("");
  let [line, setLine] = useState("");
  let [product, setProduct] = useState("");
  let [sdate, setSdate] = useState(currentDate);
  let [edate, setEdate] = useState(currentDate);
  let [rowdata, setRowdata] = useState("");
  let [message, setMessage] = useState("");

  const handleEmployee = (e) => {
    setEmployee(e.target.value);
  };
  const handleLot = (e) => {
    setLot(e.target.value);
  };
  const handleSDate = (e) => {
    setSdate(e.target.value);
  };
  const handleEDate = (e) => {
    setEdate(e.target.value);
  };
  const handleLine = (e) => {
    setLine(e.target.value);
  };
  const handleProduct = (e) => {
    setProduct(e.target.value);
  };
  const handleQuery = async () => {
    let response = await FmaService.query(
      employee,
      lot,
      line,
      product,
      sdate,
      edate
    );

    setRowdata(response);

    if (rowdata !== "" && rowdata.data.foundData.length > 0) {
      console.log(rowdata);
    }
  };
  const handleCheckEdit = (e) => {
    const id = e.currentTarget.parentElement.parentElement.parentElement.id;
    console.log(id);

    navigate("/queryResult", {
      state: { rowData: JSON.stringify(rowdata), id: id },
    });
    // console.log(e);
  };
  const handleDelete = async (e) => {
    // console.log(e.currentTarget.parentElement.parentElement.parentElement.id);
    const id = e.currentTarget.parentElement.parentElement.parentElement.id;
    const confirmed = window.confirm("確定要刪除這筆資料嗎?");
    try {
      if (confirmed) {
        let response = await fmaService.deleteOutlineRow(id);
        setMessage(response.data.msg);
        setTimeout(() => {
          setMessage("");
          handleQuery();
        }, 2500);
      }
    } catch (e) {
      console.log(e);
      setMessage(e.response.data.msg);
    }
  };

  useEffect(() => {
    // 設定日期預設為今天
    // console.log("rowdata:" + rowdata);
    // document.getElementById("date-pick").value = currentDate;
    if (state) {
      let savedData = JSON.parse(state.rowData);
      setRowdata(savedData);
      // console.log(savedData.config.url.split("/"));
      let queryItems = savedData.config.url.split("/");
      queryItems = queryItems[queryItems.length - 1];
      const [emp, lt, ln, pd, startdate, enddate] = queryItems.split("_");
      setEmployee(emp);
      setLot(lt);
      setLine(ln);
      setProduct(pd);
      setSdate(startdate);
      setEdate(enddate);
      // console.log(emp, lt, ln, pd, startdate, enddate);

      // startdate != null ? console.log(111) : console.log(222);
      // enddate != null ? setEdate(enddate) : setEdate(currentDate);
    }

    // if (state) {
    //   const { rowData, id } = state;
    //   console.log(JSON.parse(rowData));
    // let oriData = JSON.parse(rowdata).data.foundData;
    // console.log(oriData);

    // setRowdata(JSON.parse(rowdata));
    // }
    // setRowdata(state.rowdata);
  }, [state]);

  return (
    <div className="fma-data-query" style={{ padding: "2.5rem" }}>
      <div className="card text-center" style={{ marginBottom: "1.5rem" }}>
        <div className="card-header">請提供查詢資料</div>
        <div className="card-body mt-3 me-3">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <div id="employee" className="d-flex me-3 w-50">
              <label
                htmlFor="employee"
                className="col-sm-2 col-form-label"
                // style={{ width: "3rem" }}
              >
                工號:
              </label>
              <input
                value={employee}
                onChange={handleEmployee}
                type="text"
                className="form-control"
                name="employee"
                placeholder="請輸入FMA人員工號"
              />
            </div>
            <div id="lot" className="d-flex w-50">
              <label
                htmlFor="lot"
                className="col-sm-2 col-form-label "
                // style={{ width: "3rem" }}
              >
                LOT:
              </label>
              <input
                value={lot}
                onChange={handleLot}
                type="text"
                className="form-control"
                name="lot"
                placeholder="請輸入LOT"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mb-2">
            <div id="line" className="d-flex me-3 w-50">
              <label
                htmlFor="line"
                className="col-sm-2 col-form-label"
                // style={{ width: "3rem" }}
              >
                產線:
              </label>
              <select
                onChange={handleLine}
                className="form-select"
                defaultValue={"DEFAULT"}
              >
                <option value="DEFAULT" disabled>
                  ---請選擇Line別---
                </option>
                <option value="R1">R1</option>
                <option value="R2">R2</option>
                <option value="G1">G1</option>
                <option value="G2">G2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
              </select>
            </div>
            <div id="product" className="d-flex w-50">
              <label
                htmlFor="product"
                className="col-sm-2 col-form-label"
                // style={{ width: "3rem" }}
              >
                品名:
              </label>
              <input
                value={product}
                onChange={handleProduct}
                type="text"
                className="form-control"
                name="product"
                placeholder="ex:G190ACMB"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center mb-4">
            <div id="sdate" className="d-flex w-50">
              <label
                htmlFor="sdate"
                className="col-sm-2 col-form-label flex-grow-1"
                // style={{ width: "5rem" }}
              >
                開始日期:
              </label>
              <input
                value={sdate}
                onChange={handleSDate}
                className="form-control flex-shrink-1 me-2"
                // defaultValue={sdate}
                // style={{ width: "198px" }}
                type="date"
                id="sdate"
                name="sdate"
                min="2018-01-01"
              />
            </div>
            <div id="edate" className="d-flex w-50">
              <label
                htmlFor="edate"
                className="col-sm-2 col-form-label flex-grow-1 ms-2"
                // style={{ width: "5rem" }}
              >
                結束日期:
              </label>
              <input
                value={edate}
                onChange={handleEDate}
                // defaultValue={edate}
                className="form-control flex-shrink-1"
                // style={{ width: "198px" }}
                type="date"
                id="edate"
                name="edate"
                min="2018-01-01"
              />
            </div>
          </div>
          <button className="btn btn-primary btn-lg m-1" onClick={handleQuery}>
            <span>查詢資料</span>
          </button>
        </div>
      </div>
      {message && (
        <div className="alert alert-danger text-center">{message}</div>
      )}
      {rowdata !== "" && rowdata.data.foundData.length > 0 && (
        <table className="table table-hover">
          <thead>
            <tr className="table-dark">
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                日期
              </th>
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                FMA人員
              </th>
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                站別
              </th>
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                品種
              </th>
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                LOT
              </th>
              <th
                colSpan={3}
                className="align-middle border-bottom-0"
                style={{ textAlign: "center" }}
              >
                Defect前三名
              </th>
              <th
                rowSpan={2}
                className="align-middle"
                style={{ textAlign: "center" }}
              >
                編輯
              </th>
            </tr>
            <tr className="table-dark align-middle fs-6">
              <th style={{ textAlign: "center" }}>1st</th>
              <th style={{ textAlign: "center" }}>2nd</th>
              <th style={{ textAlign: "center" }}>3rd</th>
            </tr>
          </thead>
          <tbody>
            {rowdata.data.foundData.map((e) => {
              return (
                <tr id={e.id} key={e.id}>
                  <td className="text-center">
                    {new Date(e.datetime).toLocaleString("sv")}
                  </td>
                  <td className="text-center">{e.emp}</td>
                  <td className="text-center">{e.line}</td>
                  <td className="text-center">{e.product}</td>
                  <td className="text-center">{e.lot}</td>
                  <td className="text-center">{e.first}</td>
                  <td className="text-center">{e.second}</td>
                  <td className="text-center">{e.third}</td>
                  <td>
                    <div className="edit-btns d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-success btn-sm me-1"
                        onClick={handleCheckEdit}
                      >
                        <span>查詢與編輯</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={handleDelete}
                      >
                        <span>刪除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FmaQueryComponent;
