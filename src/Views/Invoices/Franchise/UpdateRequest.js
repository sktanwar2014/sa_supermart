import React, {useState, useEffect, Fragment} from 'react';
import {isNullOrUndefined} from 'util';

//Components 
import {getDateInDDMMYYYY, getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';

// APIs
import InvoiceAPI from '../../../api/invoices.js';


export default function UpdateRequest(props) {    
    let propData = props.location.state.invoice;
    const [invoice, setInvoice] =  useState(isNullOrUndefined(propData) ? {} : propData);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        if(invoice){
            getItemsForUpdateRequest();
        }        
    }, []);

	const  handleInputChange = (e) => {
		// setInputs({...inputs, [e.target.name]: e.target.value});
    }
    
    const getItemsForUpdateRequest = async (e) => {
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            console.log(invoice)
            const result = await InvoiceAPI.getItemsForUpdateRequest({
                invoice_id : invoice.invoice_id,
                invoice_version_id : invoice.invoice_version_id,
            });
            setItemList(result.itemList);
            console.log(result)
            setIsLoading(false);
            setIsSubmitting(false);
        }catch(e){
            console.log(e);
        }
    }

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);

        try{
            // let productData = [];
            // productList.map((data) => {
            //     if(isNullOrUndefined(data.break_here)){
            //         if(Number(data.will_give) !== 0){
            //             productData.push({
            //                 order_id : order.id,
            //                 ordered_id : data.id,
            //                 product_id : data.product_id,
            //                 tracking_id : data.tracking_id !== "" ? data.tracking_id : `O${order.id}P${data.product_id}U${data.selected_unit_id}-${Math.floor(Math.random()*10000)}`,
            //                 delivery_date : getDate(new Date()),
            //                 order_date : getDate(order.order_date),
            //                 paid_quantity : data.will_give,
            //                 unit_id : data.selected_unit_id,
            //                 price : data.price,
            //             })
            //         }
            //     } 
            // });
            // // console.log(productData)
            // const result = await OrderAPI.submitDeliveryDetails({productData: productData, orderId : order.id});
            setIsLoading(false);    
            setIsSubmitting(false);
            // if(result === true){    // true = inserted
            //     window.location.pathname = '/view-order-list';
            // }else{
            //     alert('Failed Insertion');
            // }
        }catch(e){
            console.log('Error...', e);
        }
    }


    return(
    <Fragment>
        <Header />
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <h3 class="mb-4 billing-heading">Invoice Update Request Form</h3>
                            <form onSubmit={handleSubmit} class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Order Id: </label>
                                            <div class="d-flex">
                                                <h6>{invoice.order_id}</h6>
                                            </div>
                                        </div>
                                    </div>   
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Invoice No.:</label>
                                            <div class="d-flex">
                                            <h6>{invoice.invoice_no}</h6>
                                            </div>
                                        </div>
                                    </div>                                      
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Invoice Total: </label>
                                            <div class="d-flex">
                                                <h6>{Number(invoice.invoice_total).toFixed(2)}</h6>
                                            </div>
                                        </div>
                                    </div> 
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Invoice Date: </label>
                                            <div class="d-flex">
                                                <h6>{getDateInDDMMYYYY(invoice.invoice_date)}</h6>                                                
                                            </div>
                                        </div>
                                    </div>  
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label>Status: </label>
                                            <div class="d-flex">
                                                <h6>{invoice.status_name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12"> <hr /> </div>
                                    <div class="col-md-12">
                                        <h5>Invoice Items</h5>
                                    </div>
                                    <div class="w-100 table-div">
                                        <table className="table table-td">
                                            <thead className="thead-primary-border">
                                                <tr className="text-center">
                                                    <th style={{minWidth : '60px'}} rowSpan={2}>#</th>
                                                    <th style={{minWidth : '50px'}} rowSpan={2}>
                                                        <input type="checkbox" />
                                                    </th>
                                                    <th style={{minWidth : '200px'}} rowSpan={2}>Item</th>
                                                    <th colSpan={2}>Current Value</th>
                                                    <th colSpan={2}>Want to change</th>
                                                    <th style={{minWidth : '200px'}} rowSpan={2}> Comment</th>
                                                    <th style={{minWidth : '100px'}} rowSpan={2}> Action</th>
                                                </tr>
                                                <tr className="text-center">
                                                    <th style={{minWidth : '120px'}}>Quantity</th>
                                                    <th style={{minWidth : '100px'}}>Cost</th>
                                                    <th style={{minWidth : '150px'}}>Quantity</th>
                                                    <th style={{minWidth : '100px'}}>Cost</th>
                                                </tr>
                                            </thead>
                                                <tbody >
                                                   {(itemList.length >0 ? itemList :[]).map((data, index) => {                                                        
                                                        return(
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <input type="checkbox" />
                                                                </td>                                                                
                                                                <td>{data.item_name}</td>
                                                                <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                <td>${Number(data.total_amt).toFixed(2)}</td>
                                                                <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                <td>{data.total_amt}</td>
                                                                <td>
                                                                    <textarea rows={2}></textarea>
                                                                </td>
                                                                <td></td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody> 
                                            </table>                                               
                                        </div>
                                        <div class="form-group p-4">
                                            <input type="submit" value="Submit" class="btn  px-4 btn-primary" disabled={isSubmitting} />
                                        </div>
                                    </div>
                                </form>                                
                            </div>
                        </div>
                    </div>
                </section>
        <Footer />        
        {isLoading ?   <CallLoader />   : null  }
    </Fragment>
    )
}
