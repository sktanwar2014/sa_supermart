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
                    // let invLength = (invoiceList.filter(ele => {return ele.invoice_id === data.invoice_id})).length;                    
                    // console.log(invLength, index)
                    // if(data.version_no === 0 && invLength > 1){
                        return(    
                            <tr class="text-center">
                            {/* <tr class="text-center accordion-toggle collapsed" id={`accordion${index+1}`} data-toggle="collapse" data-parent={`#accordion${index+1}`} href={`#collapse${data.invoice_id}`}> */}
                            {/* <td class="expand-button"></td> */}
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
                                                {data.status === 2 &&
                                                    <Fragment>
                                                        <Link
                                                            class="dropdown-item" style={{cursor: 'pointer'}}
                                                            to={{pathname: '/invoices/viewTransactionReceipt', 
                                                            state:{invoice: data}}}                                                
                                                        >View Transaction</Link>
                                                    </Fragment>
                                                }
                                                {data.status === 3 &&
                                                    <Fragment>
                                                        <Link 
                                                            class="dropdown-item" style={{cursor: 'pointer'}}
                                                            to={{pathname: '/invoices/handleInvoiceRequest', 
                                                            state:{invoice: data}}}
                                                        >Handle Request</Link>
                                                    </Fragment>
                                                }
                                            </div>
                                        </li>
                                    </ul>
                                </td>
                            </tr>                         
                        )
                    {/* }else{
                        return(    
                            <tr class=" text-center">
                                <td id={`collapse${data.invoice_id}`}></td>
                                <td id={`collapse${data.invoice_id}`}>{data.order_id}</td>
                                <td id={`collapse${data.invoice_id}`}>{data.invoice_no}</td>
                                <td id={`collapse${data.invoice_id}`}>{getDateInDDMMYYYY(data.invoice_date)}</td>
                                <td id={`collapse${data.invoice_id}`}>${Number(data.invoice_total).toFixed(2)}</td>
                                <td id={`collapse${data.invoice_id}`}>{data.billing_status_name}</td>
                                <td id={`collapse${data.invoice_id}`}>{data.status_name}</td>
                                <td id={`collapse${data.invoice_id}`}>
                                    <ul class="navbar-nav ml-auto">
                                        <li class="nav-item dropdown">
                                            <a class="nav-link dropdown-toggle" href="#"  id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Options</a>
                                            <div class="dropdown-menu" aria-labelledby="dropdown04">
                                            <a class="dropdown-item" style={{cursor: 'pointer'}} disabled> {"View & Download"} </a>
                                                {data.status === 2 &&
                                                    <Fragment>
                                                        <Link
                                                            class="dropdown-item" style={{cursor: 'pointer'}}
                                                            to={{pathname: '/invoices/viewTransactionReceipt', 
                                                            state:{invoice: data}}}                                                
                                                        >View Transaction</Link>
                                                    </Fragment>
                                                }
                                                {data.status === 3 &&
                                                    <Fragment>
                                                        <Link 
                                                            class="dropdown-item" style={{cursor: 'pointer'}}
                                                            to={{pathname: '/invoices/handleInvoiceRequest', 
                                                            state:{invoice: data}}}
                                                        >Handle Request</Link>
                                                    </Fragment>
                                                }
                                            </div>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        )
                    }                     */}
                })}
            </tbody>
        </table>    
    )
}
