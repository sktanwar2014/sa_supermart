const {isNullOrUndefined} = require('util');
const { getDateInDDMMYYYY}  = require('../common/datetime');
const styles = require('../common/Styles.js');


function buildProductRecordTable(data, columns, costingDate){
  let prodIds = [...new Set(data.map(dist => dist.id))];

  var body = [];
  body.push([
      { fillColor: '#C5C7C0', colSpan: 3,
        columns: [
          { text: 'Cost of Products for ' + getDateInDDMMYYYY(costingDate), bold: true, fontSize:10,},
        ]
      },{},{}
  ]);

  var headerRow = [];

  headerRow.push(
    { text: columns[0], style: styles.PurchaseHeader }
  );
  headerRow.push(    
    { text: columns[1], style: styles.PurchaseHeader }
  );
  headerRow.push(
    { text: columns[2], style: styles.PurchaseHeader }                   
  ); 
  
  body.push(headerRow);
  
  (prodIds.length > 0 ? prodIds : []).map((prodId, index) => {
    let matchedProd = (data.filter(ele => ele.id === prodId));                                                        
    let rowSpanNo = !isNullOrUndefined(matchedProd) ? matchedProd.length : 0;
    
    (matchedProd.length > 0 ? matchedProd :[]).map((data) => {
      let costOfEach = data.cost_of_each === "" ? isNaN(data.price_per_unit) ? 0 : (data.price_per_unit ) : data.cost_of_each;
      let dataRow = [];
      
      if(rowSpanNo !== 0){
        dataRow.push({ text: (index + 1), margin: [0,7,0,0], style: styles.PurchaseTableRow, rowSpan: rowSpanNo, });
        dataRow.push({ text: data.product_name, margin: [0,7,0,0], style: styles.PurchaseTableRow, rowSpan: rowSpanNo, });
      }else{
        dataRow.push({});
        dataRow.push({});
      }
      dataRow.push({ text: costOfEach + '/' + data.unit_name, margin: [0,7,0,0], style: styles.PurchaseTableRow });
    
      body.push(dataRow);

      rowSpanNo = 0;
    });
  });
 
  return body;
}


module.exports = function generatePurchasedItemCostReport({records, company, costingDate}) {

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
            border: [true, false, true, true],
            table: {
              widths: ['15%','60%','25%'],
              body: buildProductRecordTable(records, ['#', 'Products', 'Price ($)'], costingDate),
            },
          },
      ],  
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageMargins: [30, 30, 30, 30],
    }
    return dd ;
}