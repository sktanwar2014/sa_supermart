import React, {useState, useEffect, Fragment} from 'react';

//Components 
import {getDateInDDMMYYYY, getDate} from '../../../common/moment.js';
import CallLoader from '../../../common/Loader.js';
import AllInvoices from './TableComponents/AllInvoices.js';

// APIs
import InvoiceAPI from '../../../api/invoices.js';


const RESET_VALUES = {
    toDate : "",
    fromDate : "",
    status : "0",
    searchText: "",
}




export default function InvoicesList({stateList}) {
    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [isLoading, setIsLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(0);
    const [invoiceList, setInvoiceList] = useState([]);

    useEffect(() => {
        getInvoicesList();
    }, []);
    
    const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
    }
    
    const getInvoicesList = async (e) => {
        setIsLoading(true);        
        try{
            const result = await InvoiceAPI.getInvoiceList({
                from_date: getDate(inputs.fromDate) === 'Invalid date' ? "" : getDate(inputs.fromDate),
                to_date: getDate(inputs.toDate) === 'Invalid date' ? "" : getDate(inputs.toDate),
                status: inputs.status,
                searchText: inputs.searchText,                
            });
            setInvoiceList(result.invoiceList);
            setCurrentStatus(Number(inputs.status));
            setIsLoading(false);
        }catch(e){
            console.log(e);
        }
    }

    return(
    <Fragment>
        <section className="ftco-section">
            <div class="container">
            <h3>Invoices</h3>
            <hr />
            <div class="row justify-content-center p-bottom-30">
                    <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                        <div class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="fromDate">From </label>
                                            <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                        </div>
                                    </div>   
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="toDate">To </label>
                                            <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                        </div>
                                    </div>  
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label for="status">Status * </label>
                                            <select id="status" name="status" value={inputs.status} class="form-control" onChange={handleInputChange}>
                                                <option id={"0"} value={"0"} >All</option>
                                                {(stateList.length > 0 ? stateList : [] ).map((data, index)=>{
                                                    return(
                                                        (data.id === 1 || data.id === 2 || data.id === 3) ?   <option id={data.id} value={data.id} >{data.state_name}</option> : null
                                                    )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div> 
                                    <div class="col-md-8">
                                        <div class="form-group">                                            
                                            <input id="productName" type="text" class="form-control" placeholder="Search by invoice id, order id..." name = "searchText" value={inputs.searchText} onChange={handleInputChange} required/>
                                        </div>
                                    </div>
                                    <div class="col-md-4" style={{alignSelf: 'center'}}>
                                        <div class="form-group"> 
                                            <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getInvoicesList}>Get Filtered</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-100 table-div">
                                        <AllInvoices invoiceList={invoiceList} />
                                        {/* {(currentStatus === 0) && <AllInvoices invoiceList={invoiceList} />} */}
                                        {/* {(orderStatus == 2) && <DeliveredOrderTable orderIdsArray={orderIdsArray} orderList = {orderList} />} */}
                                        {/* {(orderStatus == 3) && <VerifiedOrderTable orderIdsArray={orderIdsArray} orderList = {orderList}  handleGenerateInvoice={handleGenerateInvoice} />} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </section>            
        {isLoading ?   <CallLoader />   : null  }
    </Fragment>
    )
}
