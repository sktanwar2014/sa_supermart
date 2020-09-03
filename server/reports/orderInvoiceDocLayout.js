const { getDateInDDMMYYYY}  = require('../common/datetime');
const styles = require('../common/Styles.js');


function buildProductRecordTable(data, columns, valueKeys){
  var body = [];
  body.push([
      { fillColor: '#C5C7C0', colSpan: 4,
        columns: [
          { text: 'DELIVERED ITEMS: ', bold: true, fontSize:10,},
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
  
    total = total + Number(row.total_amt);

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


module.exports = function orderInvoiceDocLayout(params) {
  const company = params.details.companyDetail[0];
  const shipping = params.details.shippingDetail[0];
  const products = params.itemList;
  const invoice = params.details.invoice[0];

  // console.log(company);
  // console.log(shipping);
  // console.log(products);
  // console.log(invoice);

 

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
          {
          table: {
            widths: ['*'],
            body: [
                [{
                    border: [false, false, false, false],
                    table: {
                      widths: ['*','*','*'],
                      body: [
                        [
                          
                          { text: 'Order ID: ' + shipping.order_id, style: styles.invoiceDetail, }, 
                          { text: 'Order Date: ' + getDateInDDMMYYYY(shipping.order_date), style: styles.invoiceDetail, }, 
                          { text: 'Delivery Date: ' + getDateInDDMMYYYY(shipping.delivery_date), style: styles.invoiceDetail, }, 
                        ],
                        [
                          { text: 'Invoice No: ' + invoice.invoice_no, style: styles.invoiceDetail, }, 
                          { text: 'Invoice Date: ' + getDateInDDMMYYYY(invoice.invoice_date), style: styles.invoiceDetail, }, 
                          { text: 'Total Amt: ' + Number(invoice.invoice_total).toFixed(2), style: styles.invoiceDetail, }, 
                        ],
                      ]
                    },
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
              }],         
            ],              
          },
        },
        '\n',
        {
          border: [true, false, true, true],
          table: {
            widths: ['15%','*','*','*'],                
            body: buildProductRecordTable(products, ['#', 'Items', 'Quantity', 'Cost ($)'], ['serial_no','item_name', 'quantity', 'total_amt']),
          },
        },
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
  }
  return dd ;
}