const { getDateInDDMMYYYY}  = require('../common/datetime');
const styles = require('../common/Styles.js');


function buildProductRecordTable(data, columns, valueKeys){
  var body = [];
  body.push([
      { fillColor: '#C5C7C0', colSpan: 4,
        columns: [
          { text: 'DELIVERED PRODUCTS: ', bold: true, fontSize:10,},
        ]
      },{},{},{}
  ]);

  var headerRow = [];

  headerRow.push(
    { text: columns[0], style: styles.productTableHeader }
  );
  headerRow.push(    
    { text: columns[1], style: styles.productTableHeader }
  );
  headerRow.push(
    { text: columns[2], style: styles.productTableHeader }                   
  );
  headerRow.push(
    { text: columns[3], style: styles.productTableHeader }                   
  );
  
  body.push(headerRow);

  var total = 0 ;

  data.forEach(function(row, index) {
  
    total = total + Number(row.price);

    var dataRow = [];
    valueKeys.forEach(function(column, columnIndex) {
      if(columnIndex===0){
        dataRow.push({ text: (index + 1), style: styles.productTableHeader  },);
      }else if(columnIndex === 2){
        dataRow.push({ text: row[column.toLowerCase()] + ' ' + row['unit_name'], style: styles.productTableHeader  },);
      }else if(columnIndex === 3) {
        dataRow.push({ text: (row[column]).toFixed(2), style: styles.productTableHeader  },);
      }else{
        dataRow.push({ text: row[column.toLowerCase()], style: styles.productTableHeader  },);
      }
    })
    body.push(dataRow);
  });


  var footerRow = [];
  footerRow.push(
    { text: 'Total ($) ', style: styles.alignRight, bold: true, fontSize: 10, colSpan: 3 },{},{}
  );
  footerRow.push(    
    { text: total.toFixed(2), style: styles.margins, bold: true, alignment: 'screenLeft', fontSize: 10 }
  );
  
  body.push(footerRow);

  return body;
}


module.exports = function generateInvoice(params) {
  const company = params.companyDetail[0];
  const shipping = params.shippingDetail[0];
  const products = params.productDetails;

  // console.log(company);
  // console.log(shipping);
  // console.log(products);

 

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
          // '\n',
          {
            canvas: [ {
                 type: 'line', 
                 x1: 10, y1: 10, x2: 520, y2: 10, 
                 lineWidth: 1
            } ]
          },
          '\n',
          { 
            columns: [
              [{ text: 'Invoice' , style: styles.Header2,}],
            ]
          },
          // '\n',
          {
          table: {
            widths: ['*'],
            body: [
                // [{
                //   border: [true, true, true, false],
                //    table: {
                //      widths: ['*'],
                //      body: [
                //         [{ text: 'Invoice' , style: styles.Header2,}],
                //      ]
                //    },
                //    layout: 'noBorders',
                // }],
                [{
                    border: [false, false, false, false],
                    table: {
                      widths: ['*','*','*'],
                      body: [
                        [
                          
                          { text: 'Order ID: ' + shipping.order_id, style: styles.invoiceDetail, }, 
                          { text: 'Order Date: ' + getDateInDDMMYYYY(shipping.order_date), style: styles.invoiceDetail, }, 
                          { text: 'Delivery Date: ' + getDateInDDMMYYYY(shipping.delivery_date), style: styles.invoiceDetail, }, 
                        ]
                      ]
                    },
                  //  layout: 'noBorders',
                }],
                [{
                  border: [false, false, false, false],
                  table: {
                    widths: ['*'],                    
                    body: [
                      [
                        { text: 'CUSTOMER DETAILS: ', style: styles.customerDetailHeader, }, 
                      ],
                      [                     
                      {style:styles.margins, text: [  
                        { text: shipping.full_name +  '\n', style: styles.customerDetail,  bold: true,  }, 
                        { text: shipping.flat_add + ', ' + shipping.street_add + '\n', style: styles.customerDetail, }, 
                        { text: shipping.city + ' - '+ shipping.pincode + '\n', style: styles.customerDetail, }, 
                        { text: 'Mobile: ', style: styles.customerDetail,  bold: true }, 
                        { text: shipping.mobile + '\n', style: styles.customerDetail, }, 
                        { text: 'Email: ', style: styles.customerDetail,  bold: true }, 
                        { text: shipping.email + '\n', style: styles.customerDetail, }, 
                      ]}
                      ],
                    ]
                  },
                // layout: 'noBorders'
              }],
        //       [{
        //         border: [true, false, true, false],
        //         table: {
        //           widths: ['*'],                   
        //           body: [
        //             [
        //               { text: 'ID Sighted: ', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10 }, 
        //             ],
        //             [
        //             {style:styles.margins, text: [  
        //               { text: customer[0].id_type_name + '\t\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
        //               customer[0].id_type === 2 ? { text: 'V# : ' + customer[0].dl_version_number + '\t\t\t\t\t', style: styles.Header1Center,  alignment: screenLeft } : '',
        //               { text: 'ID# : '+ customer[0].id_number +'\t\t\t\t\t', style: styles.Header1Center, alignment: screenLeft }, 
        //               { text: 'Expiry Date: ' + getDateInDDMMYYYY(customer[0].expiry_date) +  '\n', style: styles.Header1Center, alignment: screenLeft },                         
        //             ]}
        //             ],
        //           ]
        //         },
        //     // layout: 'noBorders'
        //     }],
        //     [{
        //       border: [true, false, true, false],
        //       table: {
        //         widths: ['*','*'],
        //         // margin: [100,20,10,40],
        //         // fillColor: 'gray',
        //         // background: 'gray',
        //         body: [
        //           [
        //             { text: [  
        //               { text: 'ALTERNATE CONTACTS: ', style: styles.margins, bold: true, alignment: screenLeft, fontSize: 10}, 
        //               { text: '(Can be your Father, Mother, Son, Daughter or a Friend)',  bold: true, alignment: screenLeft, fontSize: 7 },
        //             ], colSpan: 2},{}
        //           ],
        //           [
        //           {style:styles.margins, text: [
        //             { text: 'Name:\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft },   
        //             { text: customer[0].alt_c1_name + '\n', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
        //             { text: 'Address:\t\t\t' + customer[0].alt_c1_address + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //             { text: 'Contact:\t\t\t' + customer[0].alt_c1_contact + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //             { text: 'Relationship:\t' + customer[0].alt_c1_relation , style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //           ]},
        //           {style:styles.margins, text: [
        //             { text: 'Name:\t\t\t\t', style: styles.Header1Center,  bold: true,  alignment: screenLeft },   
        //             { text: customer[0].alt_c2_name + '\n', style: styles.Header1Center,  bold: true,  alignment: screenLeft }, 
        //             { text: 'Address:\t\t\t' + customer[0].alt_c2_address + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //             { text: 'Contact:\t\t\t' + customer[0].alt_c2_contact + '\n', style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //             { text: 'Relationship:\t' + customer[0].alt_c2_relation , style: styles.Header1Center, bold: true, alignment: screenLeft }, 
        //           ]},
        //           ],
        //         ]
        //       },
        //   // layout: 'noBorders'
        //   }],
        //   [{
        //     border: [true, false, true, true],
        //     table: {
        //       widths: ['*','*','*'],                
        //       body:buildTableBody(products, ['Product', 'Description', 'Payment Frequency'], ['name', 'description', 'paymentFrequency'], orderType),                  
        //     },
        // }],             
      ],              
    },
  },
  '\n',
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
              widths: ['15%','*','*','*'],                
              body: buildProductRecordTable(products, ['#', 'Product', 'Quantity', 'Price ($)'], ['serial_no','product_name', 'quantity', 'price']),
            },
          },
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
  }
  return dd ;
}