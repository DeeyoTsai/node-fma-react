import React, { useState, useRef } from "react";
// import "../css/query-form-element.css";S
import FmaTableElement from "./fma-table-element";
import FmaEchartElement from "./fma-echart-element";
import DefectTableElement from "./defect-table-element";
import FmaService from "../../services/fma.service";
import { useNavigate } from "react-router-dom";
import fmaService from "../../services/fma.service";
import FmaTextareaElement from "./fma-textarea-element";

const QueryFormComponent = (props) => {
  const navigate = useNavigate();
  // const defectArr = [
  //   "r-under",
  //   "g-under",
  //   "b-under",
  //   "bm-wp",
  //   "r-wp",
  //   "g-wp",
  //   "b-wp",
  //   "r-gel",
  //   "g-gel",
  //   "b-gel",
  //   "r-dev-abnormal",
  //   "g-dev-abnormal",
  //   "b-dev-abnormal",
  //   "r-fiber",
  //   "g-fiber",
  //   "b-fiber",
  //   "bp",
  //   "bm-dirty",
  //   "repair",
  //   "above-p",
  //   "back-dirty",
  //   "dirty",
  //   "oven-drop",
  //   "black",
  // ];

  let [standardRowNum, setStandardRowNum] = useState(5);
  // For barChart --> all Total Num data
  let [dfAvgForBar, setDfAvgForBar] = useState([]);
  // For lineChart --> all Avg Num data
  let [dfRatioForLine, setDfRatioForLine] = useState([]);
  let [sortedDfArr, setSortedDfArr] = useState([]);
  let [message, setMessage] = useState("");
  let messageRef = useRef(message);

  const handleEmployee = (e) => {
    props.setEmployee(e.target.value);
  };
  const handleDate = (e) => {
    props.setPickdate(e.target.value);
  };
  const handleLine = (e) => {
    props.setLine(e.target.value);
  };
  const handleProduct = (e) => {
    props.setProduct(e.target.value);
  };
  const handleAddItem = () => {
    setStandardRowNum((standardRowNum += 1));
    // console.log(standardRowNum);
  };
  const handleSubmitBtnEvent = async () => {
    let fmaTable = document.querySelectorAll(".df-row");
    let sheetCol = ["s", "m", "l"];
    let glassDataSet = [];
    let outlineId;
    let outlineSaveErr = "";
    if (props.line === "" || props.product === "") {
      window.alert("產線 & 品名為必填，欄位不可為空!");
    } else {
      // 送出fma Outline，包含前三大defect、送出時間 ==> outline data
      const place = ["first", "second", "third"];
      let infomData = {};
      if (sortedDfArr.length < 3) {
        sortedDfArr.forEach((e, i) => {
          let contain = e + "-" + dfRatioForLine[i].toFixed(1) + "%";
          const key = place[i];
          Object.assign(infomData, { [key]: contain });
        });
      } else {
        place.forEach((e, i) => {
          let contain =
            sortedDfArr[i] + "-" + dfRatioForLine[i].toFixed(1) + "%";
          // const key = e;
          Object.assign(infomData, { [e]: contain });
        });
      }
      // console.log(fmaTable);
      let lot = fmaTable[0].childNodes[1].innerText.slice(0, 7);
      // console.log(lot);
      // console.log("props.currentDateTime:" + props.currentDateTime);

      Object.assign(
        infomData,
        { datetime: new Date().toLocaleString("sv") },
        { emp: props.employee },
        { line: props.line },
        { product: props.product },
        { lot }
      );
      try {
        const outlineData = await fmaService.addOutline(infomData);
        outlineId = outlineData.data.savedFmaOutline.id;
      } catch (e) {
        console.log(e);
        outlineSaveErr += e.response.data.msg;
        setMessage(outlineSaveErr);
        messageRef.current = outlineSaveErr;
      }
      // 送出fma table寫資料
      fmaTable.forEach((dfRow) => {
        let rowArr = [];
        dfRow.childNodes.forEach((e) => {
          rowArr.push(e.innerText);
        });
        let g_id = rowArr[1];
        // glass id不為空字串才發送資料
        if (g_id.length > 0) {
          // const item = rowArr[0];
          const rowDfCount = rowArr.splice(2, 24).map(Number);
          const rowSml = rowArr.splice(3, 6).map(Number);
          let rowDfCountObj = {};
          let rowSmlObj = {};
          props.defectArr.map((e, i) => {
            e = e.split("-").join("");
            rowDfCountObj[e] = rowDfCount[i];
          });
          sheetCol.map((e, i) => {
            rowSmlObj[e] = rowSml[i];
          });
          // 移除沒有數值的defect column
          const rmZero = (item) =>
            Object.keys(item)
              .filter((key) => item[key] !== 0)
              .reduce((newObj, key) => {
                newObj[key] = item[key];
                return newObj;
              }, {});
          // Concate objects
          const rowData = Object.assign(
            {},
            rmZero(rowDfCountObj),
            rmZero(rowSmlObj),
            // { fmaEmployee: props.employee },
            // { line: props.line },
            { date: props.pickdate },
            // { product: props.product },
            { gid: g_id },
            { outlineId }
          );
          glassDataSet.push(rowData);
        }
      });
      try {
        await FmaService.addGlasses(props.employee, glassDataSet);
        if (messageRef.current === "") {
          window.alert("FMA資料儲存成功，將重新導向回查詢頁面!!");
          navigate("/fmaquery");
        }
      } catch (e) {
        console.log(e);
        // setMessage((prev) => prev + e.response.data.msg);
        outlineSaveErr += e.response.data.msg;
        setMessage(outlineSaveErr);
        messageRef.current = outlineSaveErr;
      }
    }
  };

  return (
    <div className="fma-data-query" style={{ padding: "2.5rem" }}>
      <div className="card text-center" style={{ marginBottom: "1.5rem" }}>
        <h3 className="card-header">{props.cardHeader}</h3>
        <div className="card-body mt-3 me-4">
          <div className="d-flex justify-content-center mb-2">
            <div id="employee" className="d-flex me-3 w-50">
              <label htmlFor="employee" className="col-sm-2 col-form-label ">
                工號:
              </label>
              <input
                defaultValue={props.employee}
                onChange={handleEmployee}
                type="text"
                className="form-control"
                name="employee"
                placeholder="請輸入FMA人員工號"
              />
            </div>
            <div id="date" className="d-flex w-50">
              <label
                htmlFor="date-pick"
                className="col-sm-2 col-form-label flex-grow-1"
                // style={{ width: "45px", height: "30" }}
              >
                日期:
              </label>
              <input
                defaultValue={props.currentDate}
                onChange={handleDate}
                className="form-control flex-shrink-1"
                // style={{ width: "198px" }}
                type="date"
                id="date-pick"
                name="datePicker"
                min="2018-01-01"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div id="line" className="d-flex me-3 w-50">
              <label htmlFor="line" className="col-sm-2 col-form-label ">
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
              <label htmlFor="product" className="col-sm-2 col-form-label ">
                品名:
              </label>
              <input
                onChange={handleProduct}
                type="text"
                className="form-control"
                name="product"
                placeholder="ex:G190ACMB"
              />
            </div>
          </div>
        </div>
        {/* {message && <div className="alert alert-danger w-75">{message}</div>} */}
        <div className="card-body text-center">
          {message && <div className="alert alert-danger">{message}</div>}
          <FmaTableElement
            currentUser={props.currentUser}
            currentDate={props.currentDate}
            employee={props.employee}
            setEmployee={props.setEmployee}
            pickdate={props.pickdate}
            setPickdate={props.setPickdate}
            line={props.line}
            setLine={props.setLine}
            product={props.product}
            setProduct={props.setProduct}
            standardRowNum={standardRowNum}
            setStandardRowNum={setStandardRowNum}
            dfAvgForBar={dfAvgForBar}
            setDfAvgForBar={setDfAvgForBar}
            dfRatioForLine={dfRatioForLine}
            setDfRatioForLine={setDfRatioForLine}
            defectArr={props.defectArr}
          />
          <FmaTextareaElement />
        </div>
        <div className="card-footer">
          <div className="d-flex justify-content-center m-1">
            <button
              type="button"
              className="btn btn-secondary me-5 p-2"
              onClick={handleAddItem}
            >
              新增項次
            </button>
            <button className="btn btn-primary" onClick={handleSubmitBtnEvent}>
              <span>送出表單</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-header text-center">FMA Result</h3>
        <div className="card-body pb-4">
          <FmaEchartElement
            dfAvgForBar={dfAvgForBar}
            setDfAvgForBar={setDfAvgForBar}
            dfRatioForLine={dfRatioForLine}
            setDfRatioForLine={setDfRatioForLine}
            defectArr={props.defectArr}
            product={props.product}
            // sortedDfArr={sortedDfArr}
            setSortedDfArr={setSortedDfArr}
          />
        </div>
        <div className="card-body pt-2 pb-4">
          <DefectTableElement defectArr={props.defectArr} />
        </div>
      </div>
    </div>
  );
};

export default QueryFormComponent;
