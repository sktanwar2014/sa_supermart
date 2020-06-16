const styles = require('../common/Styles.js');


function buildProductRecordTable(orderedProductList, subCategoryIdList, userIdList){
  var body = [];

  let tableHeader = [
    { fillColor: '#C5C7C0', colSpan: (userIdList.length + 3),
      columns: [
        { text: 'Required Products for 16-06-2020 to 17-06-2020 ', bold: true, fontSize:10,},
      ]
    },{},{}
  ];
  (userIdList.length > 0 ? userIdList : []).map((e) => {tableHeader.push({})});
  
  body.push(tableHeader);

  var headerRow = [];
  
  headerRow.push(
    {colSpan: 2,
        columns: [
          { text: 'Product List ', style: styles.productTableHeader },
        ]
    },{}
  );

  headerRow.push(
    { text: 'Total Quantity', style: styles.productTableHeader }
  );

  (userIdList.length > 0 ? userIdList : []).map(userId => {
      let userName = orderedProductList.find(ele => {return ele.user_id === userId})
        headerRow.push(
          { text: userName.user_name, style: styles.productTableHeader }
        );
  });

  // console.log(headerRow)
  body.push(headerRow);

  
  (subCategoryIdList.length > 0 ? subCategoryIdList : []).map((subCategory) => {    
    
    const sameCategoryProducts = (orderedProductList.length >0 ? orderedProductList :[]).filter(ele => {return subCategory === ele.sub_category_id});
    const prodIds = [...new Set(sameCategoryProducts.map(dist => dist.product_id))];
    let rowSpanNo = prodIds.length;
      (prodIds.length > 0 ? prodIds : []).map((prodId, index) => {
          let dataRow = [];
          let totalQuantity = 0;
          let productRecord = (sameCategoryProducts.length > 0 ? sameCategoryProducts :[]).filter(ele => {if(prodId === ele.product_id){totalQuantity = totalQuantity + ele.quantity; return ele;}});
          
            if(rowSpanNo !== 0){
              dataRow.push({ text: sameCategoryProducts[0].sub_category_name, rowSpan: rowSpanNo, style: styles.productTableHeader});
            }else{              
              dataRow.push({});
            }              
              dataRow.push({ text: productRecord[0].product_name, style: styles.productTableHeader });
              dataRow.push({ text: Number(totalQuantity).toFixed(3) + ' ' + productRecord[0].unit_name, style: styles.productTableHeader });
                (userIdList.length > 0 ? userIdList : []).map((userId) => {
                    const returnValue = (productRecord.length > 0 ? productRecord :[]).find((data) => { return userId === data.user_id });
                    let orderedUnits = returnValue !== undefined ? ((returnValue.ordered_unit_id).toString().split(',')) : [];
                      if(returnValue !== undefined){                        
                        let innerTableData = [];
                        let innerTable = [];
                        (orderedUnits.length > 0 ? orderedUnits : []).map((unitId, index) => {
                            innerTableData = [];
                            innerTableData.push({ text: (returnValue.ordered_quantity).toString().split(',')[index], style: styles.productTableHeader });
                            innerTableData.push({ text: (returnValue.ordered_unit_name).toString().split(',')[index], style: styles.productTableHeader });                            
                            innerTable.push(innerTableData);
                        });
                        innerTableData = [];
                        innerTableData.push({ text: 'Total', style: styles.productTableHeader });
                        innerTableData.push({ text: returnValue.quantity + ' ' + returnValue.unit_name, style: styles.productTableHeader });
                        innerTable.push(innerTableData);
                    
                        dataRow.push(
                          {
                            border: [true, true, true, true],
                            table: {
                              widths: ['*','*'],
                              body: innerTable,
                            },
                          },
                        );
                      }else{
                        dataRow.push({ text: '-', style: styles.productTableHeader });
                      }
                })
                rowSpanNo = 0;
                
                // console.log(dataRow)
                body.push(dataRow);
              });
            });
            
              // console.log(body)

  return body;
}


module.exports = function generateOrderedProductReport(params) {
  const orderedProductList = params.orderedProductList;
  const userIdList = params.userIdList;
  const subCategoryIdList = params.subCategoryIdList;
  const company = params.companyDetail;

  // console.log(orderedProductList);
  // console.log(userIdList);
  // console.log(subCategoryIdList);
  // console.log(company);
 

  let dd = {
    content: 
      [ 
          { 
            columns: [
              [
                { text: 'SA SUPERMART' , style: styles.Header1},
                { text: [
                     { text: '\n' + company.address + ', ', style: styles.Header1Child,  bold: true },
                     { text: company.city + ' - ' + company.postcode, style: styles.Header1Child, bold: true },
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
          // { 
          //   columns: [
          //     [{ text: 'Invoice' , style: styles.Header2,}],
          //   ]
          // },
          // '\n',
  //         {
  //         table: {
  //           widths: ['*'],
  //           body: [
  //               // [{
  //               //   border: [true, true, true, false],
  //               //    table: {
  //               //      widths: ['*'],
  //               //      body: [
  //               //         [{ text: 'Invoice' , style: styles.Header2,}],
  //               //      ]
  //               //    },
  //               //    layout: 'noBorders',
  //               // }],
  //               // [{
  //               //     border: [false, false, false, false],
  //               //     table: {
  //               //       widths: ['*','*','*'],
  //               //       body: [
  //               //         [
                          
  //               //           // { text: 'Order ID: ' + shipping.order_id, style: styles.invoiceDetail, }, 
  //               //           // { text: 'Order Date: ' + getDateInDDMMYYYY(shipping.order_date), style: styles.invoiceDetail, }, 
  //               //           // { text: 'Delivery Date: ' + getDateInDDMMYYYY(shipping.delivery_date), style: styles.invoiceDetail, }, 
  //               //         ]
  //               //       ]
  //               //     },
  //               //   //  layout: 'noBorders',
  //               // }],
  //             //   [{
  //             //     border: [false, false, false, false],
  //             //     table: {
  //             //       widths: ['*'],                    
  //             //       body: [
  //             //         [
  //             //           { text: 'CUSTOMER DETAILS: ', style: styles.customerDetailHeader, }, 
  //             //         ],
  //             //         [                     
  //             //         // {style:styles.margins, text: [  
  //             //         //   // { text: shipping.full_name +  '\n', style: styles.customerDetail,  bold: true,  }, 
  //             //         //   // { text: shipping.flat_add + ', ' + shipping.street_add + '\n', style: styles.customerDetail, }, 
  //             //         //   // { text: shipping.city + ' - '+ shipping.pincode + '\n', style: styles.customerDetail, }, 
  //             //         //   // { text: 'Mobile: ', style: styles.customerDetail,  bold: true }, 
  //             //         //   // { text: shipping.mobile + '\n', style: styles.customerDetail, }, 
  //             //         //   // { text: 'Email: ', style: styles.customerDetail,  bold: true }, 
  //             //         //   // { text: shipping.email + '\n', style: styles.customerDetail, }, 
  //             //         // ]}
  //             //         ],
  //             //       ]
  //             //     },
  //             //   // layout: 'noBorders'
  //             // }],
  //       //       [{
  //       //         border: [true, false, true, false],
  //       //         table: {
  //       //           widths: ['*'],                   
  //       //           body: [
  //       //             [
  //       //               { text: 'ID Sighted: ', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10 }, 
  //       //             ],
  //       //             [
  //       //             {style:styles.margins, text: [  
  //       //               { text: customer[0].id_type_name + '\t\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
  //       //               customer[0].id_type === 2 ? { text: 'V# : ' + customer[0].dl_version_number + '\t\t\t\t\t', style: styles.Header1Center,  alignment: screenLeft } : '',
  //       //               { text: 'ID# : '+ customer[0].id_number +'\t\t\t\t\t', style: styles.Header1Center, alignment: screenLeft }, 
  //       //               { text: 'Expiry Date: ' + getDateInDDMMYYYY(customer[0].expiry_date) +  '\n', style: styles.Header1Center, alignment: screenLeft },                         
  //       //             ]}
  //       //             ],
  //       //           ]
  //       //         },
  //       //     // layout: 'noBorders'
  //       //     }],
  //       //     [{
  //       //       border: [true, false, true, false],
  //       //       table: {
  //       //         widths: ['*','*'],
  //       //         // margin: [100,20,10,40],
  //       //         // fillColor: 'gray',
  //       //         // background: 'gray',
  //       //         body: [
  //       //           [
  //       //             { text: [  
  //       //               { text: 'ALTERNATE CONTACTS: ', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10}, 
  //       //               { text: '(Can be your Father, Mother, Son, Daughter or a Friend)',  bold: true, alignment: screenLeft, fontSize: 7 },
  //       //             ], colSpan: 2},{}
  //       //           ],
  //       //           [
  //       //           {style:styles.margins, text: [
  //       //             { text: 'Name:\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft },   
  //       //             { text: customer[0].alt_c1_name + '\n', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
  //       //             { text: 'Address:\t\t\t' + customer[0].alt_c1_address + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //             { text: 'Contact:\t\t\t' + customer[0].alt_c1_contact + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //             { text: 'Relationship:\t' + customer[0].alt_c1_relation , style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //           ]},
  //       //           {style:styles.margins, text: [
  //       //             { text: 'Name:\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft },   
  //       //             { text: customer[0].alt_c2_name + '\n', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
  //       //             { text: 'Address:\t\t\t' + customer[0].alt_c2_address + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //             { text: 'Contact:\t\t\t' + customer[0].alt_c2_contact + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //             { text: 'Relationship:\t' + customer[0].alt_c2_relation , style: styles.Header1Center, bold: true, alignment: screenLeft }, 
  //       //           ]},
  //       //           ],
  //       //         ]
  //       //       },
  //       //   // layout: 'noBorders'
  //       //   }],
  //       //   [{
  //       //     border: [true, false, true, true],
  //       //     table: {
  //       //       widths: ['*','*','*'],                
  //       //       body:buildTableBody(products, ['Product', 'Description', 'Payment Frequency'], ['name', 'description', 'paymentFrequency'], orderType),                  
  //       //     },
  //       // }],             
  //     ],              
  //   },
  // },
  // '\n',
          // '\n',
          // {
          //   table: {
          //     widths: ['*'],                    
          //     body: [
          //       [
          //         { text: 'CUSTOMER DETAILS: ', style: styles.margins, bold: true, alignment: 'screenLeft', fontSize: 10 ,  fillColor: '#C5C7C0' }, 
          //       ],
          //       [                     
          //         {style:styles.margins, text: [  
          //           { text: order.first_name + ' ' + order.last_name + '\n', style: styles.fontSize9,  bold: true, fontSize: 10 }, 
          //           { text: order.address + ', ' + order.city + ' - '+ order.postcode + '\n', style: styles.fontSize9,}, 
          //           { text: 'PH: ', style: styles.fontSize9, bold: true }, 
          //           { text: order.telephone + '\t\t', style: styles.fontSize9,}, 
          //           { text: 'Mobile: ', style: styles.fontSize9, bold: true }, 
          //           { text: order.mobile + '\n', style: styles.fontSize9,}, 
          //           { text: 'Email: ', style: styles.fontSize9, bold: true }, 
          //           { text: order.email + '\n', style: styles.fontSize9,}, 
          //         ], lineHeight: 1.2,}
          //       ],
          //     ]
          //   },
          // },
          // '\n',
          // {
          //   border: [true, false, true, true],
          //   table: {
          //     widths: ['*','*','*'],
          //     body:buildTableBody(products, ['Product', 'Description', 'Payment Type'], ['name', 'description', 'paymentType'], orderType),  
          //   },
          // },
          // '\n',   
          // {
          //   table: {
          //     widths: ['50%','50%'],
          //     body: [
          //       [
          //         { fillColor: '#C5C7C0', colSpan: 2,
          //           columns: [
          //             { text: 'ORDER DETAILS: ', bold: true, fontSize:10,  },
          //             // { text: 'From: ' + getDateInDDMMYYYY(fromDate) + '\t\t-\t\tTo: ' + getDateInDDMMYYYY(toDate) , style: styles.Header3Center},
          //           ]
          //         },{}
          //       ],
          //       [
          //         { text: 'Order Date: ' + getDateInDDMMYYYY(order.order_date) , bold: true, fontSize: 9 },
          //         { text: 'Delivery Date ' + getDateInDDMMYYYY(order.delivery_date), bold: true,  fontSize: 9 },
          //       ],
          //       [
          //         { text: 'Rentral Type: ' + (order.order_type === 1 ? "Fix" : 'Flex'),  bold: true, fontSize: 9 },
          //         { text: 'Status: ' + order.order_status_name,  bold: true, fontSize: 9,},                  
          //       ],                
          //     ]
          //   },
          // },
          '\n',
          {
            border: [true, false, true, true],
            table: {
              widths: ['20%','25%','15%','*','*'],
              body: buildProductRecordTable(orderedProductList, subCategoryIdList, userIdList),
            },
          },
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
  }
  return dd ;
}