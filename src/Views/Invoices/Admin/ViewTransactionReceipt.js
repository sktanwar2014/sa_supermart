import React, {useState, useEffect, Fragment} from 'react';
import {isNullOrUndefined} from 'util';

//Components 
import {getDateInDDMMYYYY, fullDateTime } from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import {API_URL} from '../../../api/config/Constants.js';

// APIs
import InvoiceAPI from '../../../api/invoices.js';


export default function PaymentPanel(props) {
    let propData = props.location.state.invoice;
    const [invoice, setInvoice] =  useState(isNullOrUndefined(propData) ? {} : propData);
    const [isLoading, setIsLoading] = useState(false);
    const [transaction, setTransaction] = useState({});
    
    useEffect(() => {
        getTransactionDetails();
    },[]);

    const getTransactionDetails = async () =>{
        setIsLoading(true);        
        try{
            const result = await InvoiceAPI.getTransactionDetails({
                invoice_version_id: invoice.invoice_version_id,
                invoice_id: invoice.invoice_id,
            });
            setTransaction(result.transaction[0]);
            setIsLoading(false);
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
                            <h3 class="mb-4 billing-heading">Payment Form</h3>
                            <form class="p-5 bg-light b-top-dark">
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
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Status: </label>
                                            <div class="d-flex">
                                                <h6>{invoice.status_name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Transaction Id: </label>
                                            <div class="d-flex">
                                                <h6>{
                                                    (isNullOrUndefined(transaction.transaction_no) || transaction.transaction_no === "")
                                                    ? "Transaction ID not given by user."
                                                    :   transaction.transaction_no
                                                }</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Transaction At: </label>
                                            <div class="d-flex">
                                                <h6>{fullDateTime(transaction.transaction_at)}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <hr />
                                    </div>                                    
                                    <div class="col-md-12">
                                        {(isNullOrUndefined(transaction.document) || transaction.document === "")
                                            ?
                                                <Fragment> 
                                                    <div class="form-group">
                                                        <div class="field" align="left">
                                                            <label for="transactionReceipt"> Transaction Receipt:</label>
                                                            <h2>Transaction receipt not uploaded.</h2>
                                                        </div>
                                                    </div>                                                    
                                                </Fragment>
                                            :  
                                                <Fragment>
                                                    <div class="form-group">
                                                        <div class="field" align="left">
                                                            <label for="transactionReceipt">Transaction Receipt: 
                                                                <a href={API_URL + "/api/images?path=transactionReceipt/" + transaction.document} download > Download Receipt </a>
                                                            </label>                                                
                                                        </div>
                                                    </div>
                                                    <span>                                            
                                                        <img style={{ height: '500px'}} className="imageThumb" src={API_URL + "/api/images?path=transactionReceipt/" + transaction.document}  alt={transaction.document} />                                            
                                                        <br/>
                                                    </span>
                                                </Fragment>
                                        }
                                    </div>           
                                    <div class="form-group p-4">
                                        <button class="btn  px-4 btn-primary"  type="button" onClick={() => {window.history.back()}}> Go Back </button>
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
