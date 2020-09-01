import React, {useState, useEffect, Fragment} from 'react';
import {isNullOrUndefined} from 'util';

//Components 
import {getDateInDDMMYYYY, getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import FileReaders from  '../../../utils/fileReader.js'

// APIs
import InvoiceAPI from '../../../api/invoices.js';


export default function PaymentPanel(props) {
    let propData = props.location.state.invoice;
    const [invoice, setInvoice] =  useState(isNullOrUndefined(propData) ? {} : propData);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inputs, setInputs] = useState({transaction_id: '', receipt: ''});
    
    const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
    }
console.log(inputs)
                                            
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            let doc = document.getElementById('transactionReceipt').files[0];
            let data = {
                document : doc ? await FileReaders.toBase64(doc) : '',
                transaction_id: inputs.transaction_id,                
                invoice_version_id: invoice.invoice_version_id,
                invoice_id: invoice.invoice_id,
                invoice_billing_id: invoice.invoice_billing_id,
            }
            const result = await InvoiceAPI.payInvoiceBill(data);
            setIsLoading(false); 
            setIsSubmitting(false);
            window.history.back();
        }catch(e){
            console.log('Error...', e);
        }
    }

    
    const handleFileChange = (e) => {
        if (window.File && window.FileList && window.FileReader) {
            let file = e.target.files[0];
            if(file !== null && file !== undefined && file !== ""){
                let fileReader = new FileReader();
                fileReader.onload = (e) => {
                    document.getElementById("transactionReceiptThumb").setAttribute('src',e.target.result);
                    document.getElementById("transactionReceiptThumb").setAttribute('title', "Selected image");
                    setInputs({receipt: e.target.result});
                }
                fileReader.readAsDataURL(file);
            }
        } else {
            alert("Your browser doesn't support to File API")
        }
    }

    const handleFileRemove = (e) => {
        document.getElementById("transactionReceiptThumb").removeAttribute('src');
        document.getElementById("transactionReceiptThumb").removeAttribute('title');
        document.getElementById("transactionReceipt").value = '';
        setInputs({receipt: ""});
    }


    return(
    <Fragment>
        <Header />
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <h3 class="mb-4 billing-heading">Payment Form</h3>
                            <form onSubmit={handleSubmit} class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label>Transaction Id: </label>
                                            <input type="text" name="transaction_id" class="form-control" required={inputs.receipt === ""} onChange={handleInputChange} />
                                        </div>
                                    </div>   
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <h5>OR</h5>
                                        </div>
                                    </div>   
                                    <div class="col-md-12">                                          
                                        <div class="form-group">
                                            <div class="field" align="left">
                                                <label for="transactionReceipt">Upload Transaction Receipt*</label>
                                                <input type="file" class="form-control" id="transactionReceipt" name="transactionReceipt" onChange={handleFileChange} required={inputs.transaction_id === ""} />
                                            </div>
                                        </div>
                                        <span>
                                            <img class="imageThumb" id="transactionReceiptThumb" />
                                            <br/>
                                            <span class="remove" onClick={handleFileRemove}>Remove image</span>
                                        </span>
                                    </div>           
                                    <div class="form-group p-4">
                                        <button class="btn  px-4 btn-primary"  type="submit" disabled={isSubmitting === true}> Submit </button>
                                        &nbsp;&nbsp;&nbsp;
                                        <button class="btn  px-4 btn-primary"  type="button" onClick={() => {window.history.back()}}> Cancel </button>
                                        {/* <input type="submit" value="Send Request" class="btn  px-4 btn-primary" disabled={isSubmitting} /> */}
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
