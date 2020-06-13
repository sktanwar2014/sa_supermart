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
                    <th style={{minWidth : '250px'}}>Address</th>   
                    <th style={{minWidth : '120px'}}>Delivery Date</th>
                    <th style={{minWidth : '150px'}}>Action</th>
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
                                    {totalProduct !== 0 &&
                                        <Fragment>
                                            <td rowspan={totalProduct}>{`${product.flat_add}, ${product.street_add}, ${product.city}`}</td>
                                            <td rowspan={totalProduct}>{getDateInDDMMYYYY(product.delivery_date)}</td> 
                                            <td rowspan={totalProduct}>
                                                <Link to={{pathname :'/verify-delivered-product', state : {data: products}}}>Click to verify</Link>
                                            </td>
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