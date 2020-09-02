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
    const [commonComment, setCommonComment] = useState({});
    
    useEffect(() => {
        if(invoice){
            getItemsToHandleRequest();
        }        
    }, []);
    
    const getItemsToHandleRequest = async (e) => {
        setIsLoading(true);
        try{
            const result = await InvoiceAPI.getItemsToHandleRequest({
                invoice_id : invoice.invoice_id,
                invoice_version_id : invoice.invoice_version_id,
            });
            
            setItemList(result.itemList);
            setCommonComment(result.comment[0]);
            setIsLoading(false);
        }catch(e){
            console.log(e);
        }
    }

    
    const onChangeHandler = (e) => {
        let name = (e.target.name).split('-')[0];
        let itemId = Number((e.target.name).split('-')[1]);
        let UnitId = Number((e.target.name).split('-')[2]);
        let value = e.target.value;

        let tempList = [...itemList];
        tempList.map((data) => {
            if(data.item_id === itemId && data.unit_id === UnitId){
                if(name === "newQuantity"){
                    data.new_quantity = value;
                }else if(name === "newCost"){
                    data.new_total_amt = value;
                }
              }
        });
        setItemList(tempList);
    }

    const handleCancel = () => {
        window.history.back();
    }

    const handleReqestRejection = async () => {
        setIsLoading(true);
        setIsSubmitting(true);
        try{   
            const result = await InvoiceAPI.handleReqestRejection({
                invoice_id : invoice.invoice_id,
                invoice_version_id : invoice.invoice_version_id,
                comment_id : commonComment.id,
            });
            setIsLoading(false); 
            setIsSubmitting(false);
            handleCancel();
        }catch(e){
            console.log('Error...', e);
        }
    }
                                            
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            // const result = await InvoiceAPI.postInvoiceUpdateRequest({
            //     itemList: itemList, 
            //     commonComment: commonComment,
            //     invoice_version_id: itemList[0].invoice_version_id,
            // });
            setIsLoading(false); 
            setIsSubmitting(false);
            // handleCancel();
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
                                        <div class="form-group">
                                            <h5>Comment: </h5>
                                            <textarea value={commonComment.comment} cols="30" rows="5" class="form-control" required ></textarea>
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
                                                    {/* <th style={{minWidth : '50px'}} rowSpan={2}>
                                                        <input type="checkbox" onChange= {handleEnableAll} checked={commonCheckBox} />
                                                    </th> */}
                                                    <th style={{minWidth : '200px'}} rowSpan={2}>Item</th>
                                                    <th colSpan={3}>Current Value</th>
                                                    <th colSpan={2}>Request to Update</th>
                                                    <th style={{minWidth : '200px'}} rowSpan={2}> Comment</th>
                                                </tr>
                                                <tr className="text-center">                                                    
                                                    <th style={{minWidth : '120px'}}>Quantity</th>
                                                    <th style={{minWidth : '100px'}}>Unit Price</th>
                                                    <th style={{minWidth : '130px'}}>Total Amount</th>
                                                    <th style={{minWidth : '200px'}}>Quantity</th>
                                                    <th style={{minWidth : '200px'}}>Cost</th>
                                                </tr>
                                            </thead>
                                                <tbody >
                                                   {(itemList.length >0 ? itemList :[]).map((data, index) => {                                                        
                                                        return(
                                                            <tr style={data.is_requested === 1 ? { backgroundColor: 'palegoldenrod'} : {}}>
                                                                <td>{index + 1}</td>
                                                                <td>{data.item_name}</td>
                                                                <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                <td>${Number(data.unit_price).toFixed(2)}</td>
                                                                <td>${Number(data.total_amt).toFixed(2)}</td>
                                                                <td>
                                                                    <div class="d-flex justify-content-center">
                                                                        <input type="number" name={"newQuantity-"+data.item_id+"-"+data.unit_id} class="cost-input" id={"newQuantity-"+data.item_id+"-"+data.unit_id}  value={data.new_quantity} min="0" step="0.1" onChange={onChangeHandler} required />
                                                                        <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div class="d-flex justify-content-center">
                                                                        <p class="cost-input-adoptment"> $ </p>
                                                                        <input type="number" name={"newCost-"+data.item_id+"-"+data.unit_id} class="cost-input" id={"newCost-"+data.item_id+"-"+data.unit_id} value={data.new_total_amt} min="0" step="0.1" onChange={onChangeHandler} required />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <textarea type="text" rows={2} name= {"comment-"+data.item_id+"-"+data.unit_id} id={"comment-"+data.item_id+"-"+data.unit_id} value={data.comment} required></textarea>
                                                                </td>                                                                
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody> 
                                            </table>
                                        </div>                                          
                                        <div class="form-group p-4">
                                            <button class="btn  px-4 btn-primary"  type="submit" disabled={isSubmitting === true} > {"Accept & Update Invoice"} </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button class="btn  px-4 btn-primary"  type="button" disabled={isSubmitting === true} onClick={handleReqestRejection} > Reject Request </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button class="btn  px-4 btn-primary"   type="button" onClick={handleCancel}> Cancel </button>
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
