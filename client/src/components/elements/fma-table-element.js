import React, { useState, useEffect, useRef } from "react";
// import { IconName } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import "../css/fma-table-element.css";
// import { data } from "react-router-dom";

const FmaTableElement = (props) => {
  let initObj = {
    id: "",
    date: "",
    gid: "",
  };
  props.defectArr.map((e, i) => (initObj[e.replaceAll("-", "")] = ""));
  initObj["s"] = "";
  initObj["m"] = "";
  initObj["l"] = "";
  initObj["createdAt"] = "";
  initObj["updatedAt"] = "";
  initObj["outlineId"] = "";

  const initTableData = () => {
    let initArr = [];
    for (let i = 0; i < props.standardRowNum; i++) {
      // console.log(Object.keys(initObj).length);
      let cpObj = { ...initObj };
      cpObj.id = i;
      initArr.push(cpObj);
    }
    return initArr;
  };

  let RowArr = [];
  let sheetTotal = [];

  const [totalNum, setTotalNum] = useState([]);
  const [avgNum, setAvgNum] = useState([]);
  const [ratioNum, setRatioNum] = useState([]);
  const [accRatioNum, setAccRatioNum] = useState([]);

  let [tableData, setTableData] = useState(initTableData);
  let tableDataRef = useRef(tableData);
  // let [selectPos, setSelectPos] = useState(0);
  let savedPosRef = useRef(null);

  const handleRowDelete = (e) => {
    console.log(props.standardRowNum);

    props.setStandardRowNum((prev) => {
      return (prev = prev - 1);
      // console.log(prev);
    });
    console.log(props.standardRowNum);
    const del_row_id = Number(
      e.currentTarget.parentElement.parentElement.id.split("-")[2]
    );
    console.log(del_row_id);

    setTableData((prev) => {
      // 濾除掉已刪除的欄位
      prev = prev.filter((e) => e.id !== del_row_id);
      // console.log(tableData);

      // prev.splice(del_row_id, 1);
      console.log(tableDataRef.current);
      // tableDataRef.current = prev.splice(del_row_id, 1);
      // console.log(tableDataRef.current);

      // 重設tableData id編號
      tableDataRef.current = prev.map((item, index) => {
        let cpItem = { ...item };
        cpItem.id = index;
        return cpItem;
      });
      return tableDataRef.current;
    });
  };

  // 設定FMA Result Item number
  // function setItems() {
  //   let allItems = document.querySelectorAll(".item");
  //   console.log(allItems);
  //   allItems.forEach((item, index) => {
  //     item.innerHTML = index + 1;
  //   });
  // }

  function sumArr(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0.0);
  }

  // Create a python range like function
  // function Range(size, startNum = 0) {
  //   return [...Array(size).keys()].filter((i) => i >= startNum);
  // }
  // 取得產品欄位(glass id)不為空白的列數
  function getNotEmptyRowLen() {
    let countNotEmptyRows = 0;
    let notEmptyGidRows = document.querySelectorAll(".gid");
    notEmptyGidRows.forEach((row) => {
      let gid_row_value = row.innerHTML.replace(/[<]br[^>]*[>]/gi, "");
      if (gid_row_value !== "") {
        countNotEmptyRows += 1;
      }
    });
    return countNotEmptyRows;
  }

  // const calFmaTotal = (item) => {
  //   // let dfCount = [];
  //   props.defectArr.map((e, i) => {
  //     let new_e = e.replaceAll("-", "");
  //     let contain = tableDataRef.current[item];
  //     // console.log(contain?.[new_e]);
  //     if (contain?.[new_e]) {
  //       dfCount.push(Number(contain?.[new_e]));
  //     }
  //   });
  //   return sumArr(dfCount);
  // };

  // 算sml加總
  const calSmlTotal = (item) => {
    const listItems = [];
    const smlArr = ["s", "m", "l"];

    tableData.map((e, i) => {
      if (item === i) {
        let rowCount = 0;
        smlArr.map((s, i) => {
          rowCount += Number(e?.[s]);
        });
        sheetTotal.push(rowCount);
        // props.setDfAvgForBar(rowCount);
        listItems.push(
          <td key={`df-sum-${i}`} className="df-sum">
            {rowCount}
          </td>
        );
      }
    });
    return listItems;
  };

  const changeCellValue = (e, i, dfType) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      if (isNaN(selection.getRangeAt(0).commonAncestorContainer.data)) {
        // console.log("nan");
        savedPosRef.current = 0;
      } else {
        // savedPosRef.current = selection.getRangeAt(0).startOffset;
        savedPosRef.current = Number(
          selection.getRangeAt(0).commonAncestorContainer.data
        ).toString().length;
      }
    }
    setTableData((prevData) => {
      tableDataRef.current = prevData.map((item, index) =>
        index === i ? { ...item, [dfType]: Number(e.target.innerText) } : item
      );

      return tableDataRef.current;
    });
  };

  // Handle focus/selection restoration
  useEffect(() => {
    if (savedPosRef.current !== null) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        try {
          range.setStart(range.startContainer, savedPosRef.current);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          savedPosRef.current = null;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [savedPosRef.current]);

  useEffect(() => {
    if (props.glassDataSet && tableData.length === 0) {
      // 僅初始化將glassDataSet帶入TableData
      setTableData(props.glassDataSet);
      tableDataRef.current = props.glassDataSet;
      // 重設tableData id編號
      setTableData((prev) => {
        // 重設tableData id編號
        tableDataRef.current = prev.map((item, index) => {
          let cpItem = { ...item };
          cpItem.id = index;
          return cpItem;
        });
        return tableDataRef.current;
      });
    }
    // tableData內資料變更時，回寫glassDataSet，for query網頁資料更新
    if (props.glassDataSet) {
      props.setGlassDataSet(tableDataRef.current);
    }

    // 處理新增項次
    if (tableDataRef.current.length < props.standardRowNum) {
      let cpObj = { ...initObj };
      cpObj.id = tableDataRef.current.length;
      tableDataRef.current.push(cpObj);
      setTableData(tableDataRef.current);
    }

    // 計算Total Num, Avg Num, rario, acc-ratio
    let totalNumArr = [];
    let avgNumArr = [];
    let ratioNumArr = [];
    let accRatioNumArr = [];
    for (let j = 0; j < props.defectArr.length; j++) {
      let dfSum = 0;
      let dfAvg = 0.0;
      let dfType = props.defectArr[j].replaceAll("-", "");
      for (let i = 0; i < tableDataRef.current.length; i++) {
        // console.log(i);
        dfSum += Number(tableDataRef.current[i][dfType]);
        if (getNotEmptyRowLen() > 0) {
          dfAvg = isNaN(dfSum / getNotEmptyRowLen())
            ? 0.0
            : dfSum / getNotEmptyRowLen();
        }
      }
      totalNumArr.push(dfSum);
      avgNumArr.push(dfAvg);
    }
    // set total num row data and avg num row data
    setTotalNum(totalNumArr);
    setAvgNum(avgNumArr);
    props.setDfAvgForBar([...avgNumArr]);
    // 設定百分比row data
    let dfRatio;
    for (let j = 0; j < props.defectArr.length; j++) {
      dfRatio = totalNumArr[j] / sumArr(totalNumArr);
      ratioNumArr.push(dfRatio);
    }
    setRatioNum(ratioNumArr);
    props.setDfRatioForLine([...ratioNumArr]);
    let accRatio = 0.0;
    ratioNumArr.reduce((acc, cur) => {
      accRatio += cur;
      accRatioNumArr.push(accRatio);
    }, 0.0);
    setAccRatioNum(accRatioNumArr);
  }, [props.glassDataSet, tableData, props.standardRowNum]);

  return (
    <div className="fma-result-input">
      <table
        className="fma-table"
        style={{ tableLayout: "auto", width: "100%" }}
      >
        <thead>
          <tr>
            <th rowSpan="3" style={{ width: "2vw" }}>
              項次
            </th>
            <th rowSpan="2" style={{ width: "2vw" }}>
              產品/Glass
            </th>
            <th colSpan="24">Defect Type</th>
            <th rowSpan="2">FMA Total</th>
            <th colSpan="4" rowSpan="2" className="df-cal">
              Sheet Data
            </th>
          </tr>
          <tr>
            <th colSpan="3">埋入</th>
            <th colSpan="4">WP</th>
            <th colSpan="3">凝膠</th>
            <th colSpan="3">顯像不良</th>
            <th colSpan="3">纖維</th>
            <th colSpan="3">前程</th>
            <th colSpan="5">其他</th>
          </tr>
          <tr>
            <th
              //   contentEditable="true"
              style={{ width: "10vw" }}
              className="edit-color"
            >
              {props.product}
            </th>
            <th style={{ width: "2.5vw" }}>R</th>
            <th style={{ width: "2.5vw" }}>G</th>
            <th style={{ width: "2.5vw" }}>B</th>
            <th style={{ width: "2.5vw" }}>BM</th>
            <th style={{ width: "2.5vw" }}>R</th>
            <th style={{ width: "2.5vw" }}>G</th>
            <th style={{ width: "2.5vw" }}>B</th>
            <th style={{ width: "2.5vw" }}>R</th>
            <th style={{ width: "2.5vw" }}>G</th>
            <th style={{ width: "2.5vw" }}>B</th>
            <th style={{ width: "2.5vw" }}>R</th>
            <th style={{ width: "2.5vw" }}>G</th>
            <th style={{ width: "2.5vw" }}>B</th>
            <th style={{ width: "2.5vw" }}>R</th>
            <th style={{ width: "2.5vw" }}>G</th>
            <th style={{ width: "2.5vw" }}>B</th>
            <th style={{ width: "2.5vw" }}>BP</th>
            <th style={{ width: "4vw" }}>BM髒汙</th>
            <th style={{ width: "4vw" }}>修正痕</th>
            <th style={{ width: "2.5vw" }}>膜上</th>
            <th style={{ width: "2.5vw" }}>背汙</th>
            <th style={{ width: "2.5vw" }}>髒汙</th>
            <th style={{ width: "2.5vw" }}>Oven液滴</th>
            <th style={{ width: "3.5vw" }}>黑色系</th>
            <th style={{ width: "3.5vw" }}>單枚總和</th>
            <th className="df-cal" style={{ width: "3vw" }}>
              S
            </th>
            <th className="df-cal" style={{ width: "3vw" }}>
              M
            </th>
            <th className="df-cal" style={{ width: "3vw" }}>
              L
            </th>
            <th className="df-cal">Total</th>
          </tr>
        </thead>
        <tbody id="fma-tbody">
          {/* IIF Create default columns */}
          {(() => {
            // const standardRowNum = 5;
            const listItems = [];
            for (let i = 0; i < tableData.length; i++) {
              let row_id = "df-row-";
              row_id = row_id + `${i}`;

              listItems.push(
                <tr className="df-row" key={i} id={row_id}>
                  <td className="item">{i + 1}</td>
                  <td
                    className="gid edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    // onInput={(e) => (tableData[i].gid = e.target.innerText)}
                    onInput={(e) => {
                      // Save cursor position
                      const selection = window.getSelection();
                      if (selection.rangeCount > 0) {
                        savedPosRef.current =
                          selection.getRangeAt(0).startOffset;
                      }
                      setTableData((prevData) => {
                        tableDataRef.current = prevData.map((item, id) =>
                          id === i ? { ...item, gid: e.target.innerText } : item
                        );
                        return tableDataRef.current;
                      });
                    }}
                  >
                    {tableData.length > 0 && tableData[i].gid}
                  </td>
                  <td
                    // ref={savedPosRef}
                    className="r-under edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "runder")}
                  >
                    {tableData.length > 0 && tableData[i].runder}
                  </td>
                  <td
                    className="g-under edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    // onInput={(e) => (tableData[i].gunder = e.target.innerText)}
                    onInput={(e) => changeCellValue(e, i, "gunder")}
                  >
                    {tableData.length > 0 && tableData[i].gunder}
                  </td>
                  <td
                    className="b-under edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bunder")}
                  >
                    {tableData.length > 0 && tableData[i].bunder}
                  </td>
                  <td
                    className="bm-wp edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bmwp")}
                  >
                    {tableData.length > 0 && tableData[i].bmwp}
                  </td>
                  <td
                    className="r-wp edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "rwp")}
                  >
                    {tableData.length > 0 && tableData[i].rwp}
                  </td>
                  <td
                    className="g-wp edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "gwp")}
                  >
                    {tableData.length > 0 && tableData[i].gwp}
                  </td>
                  <td
                    className="b-wp edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bwp")}
                  >
                    {tableData.length > 0 && tableData[i].bwp}
                  </td>
                  <td
                    className="r-gel edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "rgel")}
                  >
                    {tableData.length > 0 && tableData[i].rgel}
                  </td>
                  <td
                    className="g-gel edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "ggel")}
                  >
                    {tableData.length > 0 && tableData[i].ggel}
                  </td>
                  <td
                    className="b-gel edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bgel")}
                  >
                    {tableData.length > 0 && tableData[i].bgel}
                  </td>
                  <td
                    className="r-dev-abnormal edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "rdevabnormal")}
                  >
                    {tableData.length > 0 && tableData[i].rdevabnormal}
                  </td>
                  <td
                    className="g-dev-abnormal edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "gdevabnormal")}
                  >
                    {tableData.length > 0 && tableData[i].gdevabnormal}
                  </td>
                  <td
                    className="b-dev-abnormal edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bdevabnormal")}
                  >
                    {tableData.length > 0 && tableData[i].bdevabnormal}
                  </td>
                  <td
                    className="r-fiber edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "rfiber")}
                  >
                    {tableData.length > 0 && tableData[i].rfiber}
                  </td>
                  <td
                    className="g-fiber edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "gfiber")}
                  >
                    {tableData.length > 0 && tableData[i].gfiber}
                  </td>
                  <td
                    className="b-fiber edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bfiber")}
                  >
                    {tableData.length > 0 && tableData[i].bfiber}
                  </td>
                  <td
                    className="bp edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bp")}
                  >
                    {tableData.length > 0 && tableData[i].bp}
                  </td>
                  <td
                    className="bm-dirty edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "bmdirty")}
                  >
                    {tableData.length > 0 && tableData[i].bmdirty}
                  </td>
                  <td
                    className="repair edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "repair")}
                  >
                    {tableData.length > 0 && tableData[i].repair}
                  </td>
                  <td
                    className="above-p edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "abovep")}
                  >
                    {tableData.length > 0 && tableData[i].abovep}
                  </td>
                  <td
                    className="back-dirty edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "backdirty")}
                  >
                    {tableData.length > 0 && tableData[i].backdirty}
                  </td>
                  <td
                    className="dirty edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "dirty")}
                  >
                    {tableData.length > 0 && tableData[i].dirty}
                  </td>
                  <td
                    className="oven-drop edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "ovendrop")}
                  >
                    {tableData.length > 0 && tableData[i].ovendrop}
                  </td>
                  <td
                    className="black edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "black")}
                  >
                    {tableData.length > 0 && tableData[i].black}
                  </td>
                  {(() => {
                    let itemList = [];
                    tableData.forEach((e, id) => {
                      if (id === i) {
                        let dfRowArr = [];
                        let dfCount = 0;
                        for (let j = 0; j < props.defectArr.length; j++) {
                          let defType = props.defectArr[j];
                          defType = defType.replaceAll("-", "");
                          dfCount += Number(e?.[defType]);
                          dfRowArr.push(Number(e?.[defType]));
                        }
                        RowArr.push(dfRowArr);
                        itemList.push(
                          <td key={`fma-total-${i}`} className="fma-total">
                            {dfCount}
                          </td>
                        );
                      }
                    });
                    return itemList;
                  })()}
                  {/* </td> */}
                  <td
                    className="s edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "s")}
                  >
                    {tableData.length > 0 && tableData[i].s}
                  </td>
                  <td
                    className="m edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "m")}
                  >
                    {tableData.length > 0 && tableData[i].m}
                  </td>
                  <td
                    className="l edit-color"
                    suppressContentEditableWarning
                    contentEditable={!props.editable}
                    onInput={(e) => changeCellValue(e, i, "l")}
                  >
                    {tableData.length > 0 && tableData[i].l}
                  </td>
                  {/* <td className="df-sum">{calSmlTotal(i)}</td> */}
                  {calSmlTotal(i)}
                  <td
                    style={{
                      borderTopStyle: "hidden",
                      borderRightStyle: "hidden",
                      borderBottomStyle: "hidden",
                      padding: "0.2rem 0rem 0rem 0.2rem",
                      width: "2rem",
                    }}
                  >
                    <button
                      disabled={props.editable}
                      onClick={handleRowDelete}
                      className="trash-button"
                      style={{
                        border: "none",
                        cursor: "pointer",
                        background: "rgba(255,255,255,0)",
                      }}
                    >
                      <FaTrashAlt className="trash-button-icon" />
                    </button>
                  </td>
                </tr>
              );
            }
            return listItems;
          })()}
        </tbody>
        <tfoot>
          <tr className="total-num">
            <td colSpan="2">Total Num</td>
            {totalNum.map((e, i) => {
              return (
                <td key={`total-num-${i}`} className="df-total-num">
                  {e}
                </td>
              );
            })}
            {<td className="df-total-all">{sumArr(totalNum)}</td>}
            {/* <td className="fma-total-sum"></td> */}
            <td className="s-m-l-sum" colSpan={3}>
              Avg.
            </td>
            <td className="s-m-l-sum">
              {(sumArr(sheetTotal) / getNotEmptyRowLen()).toFixed(1)}
            </td>
          </tr>
          <tr className="avg-num">
            <td colSpan="2">Avg Num</td>
            {avgNum.map((e, i) => {
              return (
                <td key={`avg-num-${i}`} className="df-avg-num">
                  {e.toFixed(1).toString()}
                </td>
              );
            })}
            {
              <td className="fma-avg-all">
                {sumArr(avgNum).toFixed(1).toString()}
              </td>
            }
          </tr>
          <tr className="df-ratio">
            <td colSpan="2">百分比(%)</td>
            {ratioNum.map((e, i) => {
              return (
                <td key={`df-ratio-${i}`} className="df-ratio-num">
                  {(e * 100).toFixed(0).toString()}
                </td>
              );
            })}
            {
              <td className="df-ratio-all">
                {(sumArr(ratioNum) * 100).toFixed(0).toString()}
              </td>
            }
          </tr>
          <tr className="acc-ratio">
            <td colSpan="2">累計百分比</td>
            {accRatioNum.map((e, i) => {
              return (
                <td key={`acc-ratio-${i}`} className="df-acc-num">
                  {(e * 100).toFixed(0).toString()}
                </td>
              );
            })}
            {
              <td className="df-acc-all">
                {(accRatioNum[accRatioNum.length - 1] * 100)
                  .toFixed(0)
                  .toString()}
              </td>
            }
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default FmaTableElement;
