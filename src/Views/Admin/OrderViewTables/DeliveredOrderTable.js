import React, {Fragment} from 'react';
import {Link} from  'react-router-dom';

//Components 
import {getDateInDDMMYYYY, getDate} from '../../../common/moment.js';

export default function DeliveredOrderTable({orderIdsArray, orderList}) {    
    return(
        <table className="table table-td">
            <thead class="thead-primary">
                <tr class="text-center">
                    <th style={{minWidth : '50px'}}>#</th>
                    <th style={{minWidth : '100px'}}>Order Date</th>
                    <th style={{minWidth : '80px'}}>Order Id</th>
                    <th style={{minWidth : '180px'}}>Customer</th>
                    <th style={{minWidth : '200px'}}>Product</th>
                    <th style={{minWidth : '120px'}}>Quantity</th>
                    <th style={{minWidth : '125px'}}>Price</th>
                    <th style={{minWidth : '250px'}}>Address</th>   
                    <th style={{minWidth : '120px'}}>Delivery Date</th>                  
                </tr>
            </thead>
            <tbody>
                {(orderIdsArray.length > 0 ? orderIdsArray : []).map((orderId, index) => {
                    let products = orderList.filter(pro => pro.id === orderId);
                    let totalProduct = products.length;
                    return(
                        (products.length >0 ? products :[]).map((product) =>  {
                            return(
                                <tr class="text-center">
                                    {totalProduct !== 0 &&
                                        <Fragment>
                                            <td rowspan={totalProduct}>{index + 1}</td>
                                            <td rowspan={totalProduct}>{getDateInDDMMYYYY(product.order_date)}</td>
                                            <td rowspan={totalProduct}>{product.order_id}</td>
                                            <td rowspan={totalProduct}>{product.full_name}</td>
                                        </Fragment>
                                    }
                                    <td>{product.product_name}</td>
                                    <td>{`${product.quantity}  ${product.unit_name}`}</td>
                                    <td>{`${product.price}`}</td>
                                    {totalProduct !== 0 &&
                                        <Fragment>
                                            <td rowspan={totalProduct}>{`${product.flat_add}, ${product.street_add}, ${product.city}`}</td>
                                            <td rowspan={totalProduct}>{getDateInDDMMYYYY(product.delivery_date)}</td> 
                                        </Fragment>
                                    }   
                                    <div style={{display:'none'}}>{totalProduct = 0}</div>
                                </tr>
                                )
                            })
                        )
                    })
                }
            </tbody>
        </table>    
    )
}