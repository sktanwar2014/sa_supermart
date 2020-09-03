import React, {useState, useEffect, Fragment} from 'react';
import { Link } from 'react-router-dom';

//Components 
import {getDateInDDMMYYYY, getDate} from '../../../../common/moment.js';

// APIs

export default function AllInvoices({invoiceList, downloadOrderInvoiceVersion}) {
    return(
        <table  className="table table-td">
            <thead class="thead-primary">
                <tr class="text-center">
                    <th style={{minWidth : '80px'}}>#</th>
                    <th style={{minWidth : '120px'}}>Order Id</th>
                    <th style={{minWidth : '120px'}}>Invoice No</th>
                    <th style={{minWidth : '180px'}}>Invoice Date</th>
                    <th style={{minWidth : '150px'}}>Total Amount</th>
                    <th style={{minWidth : '150px'}}>Payment Status</th>
                    <th style={{minWidth : '150px'}}>Status</th>
                    <th style={{minWidth : '200px'}}>Action</th>
                </tr>
            </thead>
            <tbody>
                {(invoiceList.length > 0 ? invoiceList : []).map((data, index) => {
                    return(
                        <tr class="text-center">                    
                            <td>{index + 1}</td>
                            <td>{data.order_id}</td>
                            <td>{data.invoice_no}</td>
                            <td>{getDateInDDMMYYYY(data.invoice_date)}</td>
                            <td>${Number(data.invoice_total).toFixed(2)}</td>
                            <td>{data.billing_status_name}</td>
                            <td>{data.status_name}</td>
                            <td>
                                <ul class="navbar-nav ml-auto">
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#"  id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</a>
                                        <div class="dropdown-menu" aria-labelledby="dropdown04">                                            
                                        <a class="dropdown-item" style={{cursor: 'pointer'}} disabled onClick={()=>{downloadOrderInvoiceVersion(data)}} > {"View & Download"} </a>
                                            {data.status === 9 &&
                                                <Fragment>
                                                    <Link 
                                                        class="dropdown-item" style={{cursor: 'pointer'}}
                                                        to={{pathname: '/invoices/billpay', 
                                                        state:{invoice: data}}}                                                
                                                    >Pay</Link>
                                                    <Link 
                                                        class="dropdown-item" style={{cursor: 'pointer'}}
                                                        to={{pathname: '/invoices/update-request', 
                                                        state:{invoice: data}}}
                                                    >Request to Update</Link>
                                                </Fragment>
                                            }                                            
                                        </div>
                                    </li>
                                </ul>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>    
    )
}
