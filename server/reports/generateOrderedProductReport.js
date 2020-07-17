const styles = require('../common/Styles.js');
const { getDateInDDMMYYYY}  = require('../common/datetime');


const setTopMarginOfCellForVerticalCentering = (ri, node) => {
  const calcCellHeight = (cell, ci) => {
      if (cell._height !== undefined) {
          return cell._height;
      }
      let width = 0;
      for (let i = ci; i < ci + (cell.colSpan || 1); i++) {
          width += node.table.widths[i]._calcWidth;
      }
      let calcLines = (inlines) => {
          let tmpWidth = width;
          let lines = 1;
          inlines.forEach(inline => {
              tmpWidth = tmpWidth - inline.width;
              if (tmpWidth < 0) {
                  lines++;
                  tmpWidth = width - inline.width;
              }
          });
          return lines;
      };

      cell._height = 0;
      if (cell._inlines && cell._inlines.length) {
          let lines = calcLines(cell._inlines);
          cell._height = cell._inlines[0].height * lines;
      } else if (cell.stack && cell.stack[0] && cell.stack[0]._inlines[0]) {
          cell._height = cell.stack.map(item => {
              let lines = calcLines(item._inlines);
              return item._inlines[0].height * lines;
          }).reduce((prev, next) => prev + next);
      } else if (cell.table) {
          // TODO...
          console.log(cell);
      }

      cell._space = cell._height;
      if (cell.rowSpan) {
          for (let i = ri + 1; i < ri + (cell.rowSpan || 1); i++) {
              cell._space += Math.max(...calcAllCellHeights(i)) + padding * (i - ri) * 2;
          }
          return 0;
      }

      ci++;
      return cell._height;
  };
  const calcAllCellHeights = (rIndex) => {
      return node.table.body[rIndex].map((cell, ci) => {
          return calcCellHeight(cell, ci);
      });
  };

  calcAllCellHeights(ri);
  const maxRowHeights = {};
  node.table.body[ri].forEach(cell => {
      if (!maxRowHeights[cell.rowSpan] || maxRowHeights[cell.rowSpan] < cell._space) {
          maxRowHeights[cell.rowSpan] = cell._space;
      }
  });

  node.table.body[ri].forEach(cell => {
      if (cell.ignored) return;

      if (cell._rowSpanCurrentOffset) {
          cell._margin = [0, 0, 0, 0];
      } else {
          let topMargin = (maxRowHeights[cell.rowSpan] - cell._height) / 2;
          if (cell._margin) {
              cell._margin[1] += topMargin;
          } else {
              cell._margin = [0, topMargin, 0, 0];
          }
      }
  });

  return  2
}


function pageTables(fromDate, toDate, orderedProductList, subCategoryIdList, userIdList){
    const totalUserIdList = [...userIdList];    
    let isFirstPage = 1;
    let idArray = [];
    let tables = [];
    while(userIdList.length > 0){
      let widths = ['4%', '12%'];
      if(userIdList.length >= 7){
        if(isFirstPage === 1){
          idArray = userIdList.splice(0,6);
        }else{
          idArray = userIdList.splice(0,7);
        }
      }else if(userIdList.length >=6){
        if(isFirstPage === 1){
          idArray = userIdList.splice(0,6);
        }else{
          idArray = userIdList.splice(0,userIdList.length);
        }
      }else{
          idArray = userIdList.splice(0, userIdList.length);
      }
      
      if(isFirstPage === 1){
        widths.push('15%');
      }
      
        idArray.map((e) => {widths.push('12%')});

        tables.push({
          border: [true, false, true, true],
          table: {
            widths: widths,
            headerRows: 2,
            body: buildProductRecordTable(fromDate, toDate, orderedProductList, subCategoryIdList, idArray, isFirstPage, totalUserIdList),
            dontBreakRows: true,
          },
          layout: {paddingTop: function (i, node) { return 20; }},
          pageBreak: (userIdList.length>0) ? "after" : "",
        });

        isFirstPage = 0;
    }
    return tables;
}

function buildProductRecordTable(fromDate, toDate, orderedProductList, subCategoryIdList, userIdList, isFirstPage, totalUserIdList){
  var body = [];

  let tableHeader = [{
      fillColor: '#C5C7C0', 
      colSpan: (isFirstPage===1) ? (userIdList.length + 3) : (userIdList.length + 2),
      columns: [
        {text: 'Required Products for ' + getDateInDDMMYYYY(fromDate) + ' to ' + getDateInDDMMYYYY(toDate), bold: true, fontSize:10
      }]
  },{}];
    if(isFirstPage === 1) { tableHeader.push({}) };
    (userIdList.length > 0 ? userIdList : []).map((e) => {tableHeader.push({})});
    body.push(tableHeader);  

  let headerRow = [];
  
  headerRow.push(
    { text: 'S.No.', style: styles.productTableSubHeader }
  );
  headerRow.push( { text: 'Product List ', style: styles.productTableSubHeader });
  
  if(isFirstPage === 1){
    headerRow.push( { text: 'Total Quantity', style: styles.productTableSubHeader});
  }

  (userIdList.length > 0 ? userIdList : []).map(userId => {
      let userName = orderedProductList.find(ele => {return ele.user_id === userId})
        headerRow.push(
          { text: userName.login_id, style: styles.productTableSubHeader }
        );
  });

  body.push(headerRow);
  
  
  let index = 1;
  (subCategoryIdList.length > 0 ? subCategoryIdList : []).map((subCategory) => {
    const sameCategoryProducts = (orderedProductList.length >0 ? orderedProductList :[]).filter(ele => {return subCategory === ele.sub_category_id});
    
    body.push([{
      text: sameCategoryProducts[0].sub_category_name, 
      alignment: 'left', 
      colSpan: (isFirstPage===1) ? (userIdList.length + 3) : (userIdList.length + 2),
      margin: [5,5],
      bold: true,
      fontSize: 8
    }]);

    const prodIds = [...new Set(sameCategoryProducts.map(dist => dist.product_id))];
      (prodIds.length > 0 ? prodIds : []).map((prodId) => {
        let dataRow = [];
        let totalQuantity = 0;
        let seprateTotalOfUnit = [];
        let clientRecord = [];
        let productRecord = (sameCategoryProducts.length > 0 ? sameCategoryProducts :[]).filter(ele => {if(prodId === ele.product_id){totalQuantity = totalQuantity + ele.quantity; return ele;}});
        
        if(isFirstPage === 1){
          (totalUserIdList.length > 0 ? totalUserIdList : []).map((userId) => {
            const returnValue = (productRecord.length > 0 ? productRecord :[]).find((data) => { return userId === data.user_id });
            let orderedUnits = returnValue !== undefined ? ((returnValue.ordered_unit_id).toString().split(',')) : [];
              if(returnValue !== undefined){
                (orderedUnits.length > 0 ? orderedUnits : []).map((unitId, index) => {
                  let quantity = Number((returnValue.ordered_quantity).toString().split(',')[index]);
                  let unit_name = (returnValue.ordered_unit_name).toString().split(',')[index];
                 
                  if(seprateTotalOfUnit.length === 0){
                      seprateTotalOfUnit.push({unit: unit_name, quantity: Number(quantity)})
                  }else{
                      const found = seprateTotalOfUnit.find((ele) => {return ele.unit == unit_name});
                      if(found){
                          let temp = [...seprateTotalOfUnit];
                          temp.map((data, index) => {
                              if(data.unit == unit_name){
                                  seprateTotalOfUnit[index].quantity =  seprateTotalOfUnit[index].quantity + Number(quantity);
                              }
                          })
                      }else{
                          seprateTotalOfUnit.push({unit: unit_name, quantity: Number(quantity)})
                      }
                  }
                });                
              }
            });        
          }

        (userIdList.length > 0 ? userIdList : []).map((userId) => {
          const returnValue = (productRecord.length > 0 ? productRecord :[]).find((data) => { return userId === data.user_id });
          let orderedUnits = returnValue !== undefined ? ((returnValue.ordered_unit_id).toString().split(',')) : [];
            if(returnValue !== undefined){
              let data = '';
              (orderedUnits.length > 0 ? orderedUnits : []).map((unitId, index) => {
                let quantity = Number((returnValue.ordered_quantity).toString().split(',')[index]);
                let unit_name = (returnValue.ordered_unit_name).toString().split(',')[index];
                
                data = data +  quantity + ' ' + unit_name+ ', \n';
              });
              data = data + '_________________\nTotal: ' + returnValue.quantity + ' ' + returnValue.unit_name;
              clientRecord.push({ text: data, style: styles.productTableHeader });
            }else{
              clientRecord.push({ text: '-',  margin: [0,7,0,0], style: styles.productTableHeader }); 
            }
        });   
          
        dataRow.push({ text: (index), style: styles.productTableHeader,  margin: [0,7,0,0],});
        dataRow.push({ text: productRecord[0].product_name, margin: [0,7,0,0], style: styles.productTableHeader });
        if(isFirstPage === 1){
          let totUnit = '';
          seprateTotalOfUnit.map((u) => {
            totUnit = totUnit +  u.quantity + ' ' + u.unit+ ', \n';
          });
          totUnit = totUnit + '_________________\nTotal: ' + Number(totalQuantity).toFixed(3) + ' ' + productRecord[0].unit_name;
          dataRow.push({ text: totUnit,  style: styles.productTableHeader });
        }

        
        clientRecord.map((data) => {
          dataRow.push(data); 
        })

        body.push(dataRow);
        index += 1;
      });
    });

  





    

// function pageTables(fromDate, toDate, orderedProductList, subCategoryIdList, userIdList){
//   let isFirstPage = 1;
//   let idArray = [];
//   let tables = [];
//   while(userIdList.length > 0){
//     let widths = ['5%'];
//     if(userIdList.length >= 6){
//       if(isFirstPage === 1){
//         idArray = userIdList.splice(0,3);
//       }else{
//         idArray = userIdList.splice(0,6);
//       }
//     }else if(userIdList.length >=3){
//       if(isFirstPage === 1){
//         idArray = userIdList.splice(0,3);
//       }else{
//         idArray = userIdList.splice(0,userIdList.length);
//       }
//     }else{
//         idArray = userIdList.splice(0, userIdList.length);
//     }
    
//     if(isFirstPage === 1){
//       widths.push('15%');
//       widths.push('20%');
//       widths.push('12%');
//     }
    
//       idArray.map((e) => {widths.push('16%')});

//       tables.push({
//         border: [true, false, true, true],
//         table: {
//           widths: widths,
//           body: buildProductRecordTable(fromDate, toDate, orderedProductList, subCategoryIdList, idArray, isFirstPage),
//         },
//         layout: { paddingTop: setTopMarginOfCellForVerticalCentering },
//         pageBreak: (userIdList.length>0) ? "after" : "",
//       });

//       isFirstPage = 0;
//   }
//   return tables;
// }


  // (subCategoryIdList.length > 0 ? subCategoryIdList : []).map((subCategory, index) => {    
  //   const sameCategoryProducts = (orderedProductList.length >0 ? orderedProductList :[]).filter(ele => {return subCategory === ele.sub_category_id});
  //   const prodIds = [...new Set(sameCategoryProducts.map(dist => dist.product_id))];
  //   let rowSpanNo = prodIds.length;
  //     (prodIds.length > 0 ? prodIds : []).map((prodId) => {
  //       let dataRow = [];
  //       let totalQuantity = 0;
  //       let productRecord = (sameCategoryProducts.length > 0 ? sameCategoryProducts :[]).filter(ele => {if(prodId === ele.product_id){totalQuantity = totalQuantity + ele.quantity; return ele;}});
  //         if(rowSpanNo !== 0){
  //           dataRow.push({ text: (index + 1), rowSpan: rowSpanNo, style: styles.productTableHeader});
  //           if(isFirstPage === 1){
  //             dataRow.push({ text: sameCategoryProducts[0].sub_category_name, rowSpan: rowSpanNo, style: styles.productTableHeader});
  //           }              
  //         }else{
  //           dataRow.push({});
  //           if(isFirstPage === 1){
  //             dataRow.push({});
  //           }
  //         }

  //         if(isFirstPage === 1){
  //           dataRow.push({ text: productRecord[0].product_name, style: styles.productTableHeader });
  //           dataRow.push({ text: Number(totalQuantity).toFixed(3) + ' ' + productRecord[0].unit_name, style: styles.productTableHeader });
  //         }
  //         (userIdList.length > 0 ? userIdList : []).map((userId) => {
  //             const returnValue = (productRecord.length > 0 ? productRecord :[]).find((data) => { return userId === data.user_id });
  //             let orderedUnits = returnValue !== undefined ? ((returnValue.ordered_unit_id).toString().split(',')) : [];
  //               if(returnValue !== undefined){                        
  //                 let innerTableData = [];
  //                 let innerTable = [];
  //                 (orderedUnits.length > 0 ? orderedUnits : []).map((unitId, index) => {
  //                     innerTableData = [];
  //                     innerTableData.push({ text: (returnValue.ordered_quantity).toString().split(',')[index], style: styles.productTableHeader });
  //                     innerTableData.push({ text: (returnValue.ordered_unit_name).toString().split(',')[index], style: styles.productTableHeader });                            
  //                     innerTable.push(innerTableData);
  //                 });
  //                 innerTableData = [];
  //                 innerTableData.push({ text: 'Total', style: styles.productTableHeader });
  //                 innerTableData.push({ text: returnValue.quantity + ' ' + returnValue.unit_name, style: styles.productTableHeader });
  //                 innerTable.push(innerTableData);
              
  //                 dataRow.push(
  //                   {
  //                     border: [true, true, true, true],
  //                     table: {
  //                       widths: ['*','*'],
  //                       body: innerTable,
  //                     },
  //                     layout: { paddingTop: setTopMarginOfCellForVerticalCentering },
  //                   },
  //                 );
  //               }else{
  //                 dataRow.push({ text: '-', style: styles.productTableHeader });
  //               }
  //         })
  //       rowSpanNo = 0;
  //       body.push(dataRow);
  //     });
  //   });

  return body;
}


module.exports = function generateOrderedProductReport(params) {
  const fromDate = params.fromDate;
  const toDate = params.toDate;
  const orderedProductList = params.orderedProductList;
  const userIdList = params.userIdList;
  const subCategoryIdList = params.subCategoryIdList;
  const company = params.companyDetail;

  let dd = {
    content: 
      [ 
          { 
            columns: [
              [
                { text: 'SA SUPERMART' , style: styles.Header1},
                { lineHeight: '1.4', text: [
                     { text: '\n' + company.address + ', ', style: styles.Header1Child,  bold: true },
                     { text: company.city + ', ' + company.state + ' - ' + company.postcode, style: styles.Header1Child, bold: true },
                     { text: '\n[PH]:', style: styles.Header1Child, bold: true },
                     { text: company.mobile + '\n', style: styles.Header1Child },
                     { text: 'Email: ', style: styles.Header1Child, bold: true },
                     { text: company.email + '\n', style: styles.Header1Child } 
                    ]
                  },
              ],
            ]
          },
          '\n',
          {
            canvas: [ {
                 type: 'line', 
                 x1: 10, y1: 10, x2: 520, y2: 10, 
                 lineWidth: 1
            } ]
          },
          '\n',
          pageTables(fromDate, toDate, orderedProductList, subCategoryIdList, userIdList),
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
  }
  return dd ;

}