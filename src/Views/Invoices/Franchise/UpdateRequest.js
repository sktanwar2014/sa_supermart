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
    const [commonCheckBox, setCommonCheckBox] = useState(false);
    const [commonComment, setCommonComment] = useState('');
    
    useEffect(() => {
        if(invoice){
            getItemsForUpdateRequest();
        }        
    }, []);
    
    const getItemsForUpdateRequest = async (e) => {
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            const result = await InvoiceAPI.getItemsForUpdateRequest({
                invoice_id : invoice.invoice_id,
                invoice_version_id : invoice.invoice_version_id,
            });
            setItemList(result.itemList);
            setIsLoading(false);
            setIsSubmitting(false);
        }catch(e){
            console.log(e);
        }
    }

    
    const onChangeHandler = (e) => {
        let name = (e.target.name).split('-')[0];
        let itemId = Number((e.target.name).split('-')[1]);
        let UnitId = Number((e.target.name).split('-')[2]);
        let value = e.target.value;

        let newQuantity = document.getElementById(`newQuantity-${itemId}-${UnitId}`).value;
        let newCost = document.getElementById(`newCost-${itemId}-${UnitId}`).value;
        let comment = document.getElementById(`comment-${itemId}-${UnitId}`).value;

        let tempList = [...itemList];
        tempList.map((data) => {
            if(data.item_id === itemId && data.unit_id === UnitId){
                if(Number(newQuantity) !== data.new_quantity_clone || Number(newCost) !== data.new_total_amt_clone || comment !== data.comment_clone){
                    data.is_requested = 1; 
                }else{
                    data.is_requested = 0;
                }
                if(name === "newQuantity"){
                    data.new_quantity = value;
                }else if(name === "newCost"){
                    data.new_total_amt = value;
                }else if(name === "comment"){
                    data.comment = value;                    
                }else if(name === "isDisable"){
                    if(e.target.checked === true){
                        data.is_disable = 0;
                    }else {
                        data.is_disable = 1;
                    }
                }                
              }
        });
        setItemList(tempList);
    }

    const handleEnableAll = (e) => {
        setCommonCheckBox(e.target.checked);
        let tempList = [...itemList];
        tempList.map((data) => {
            if(e.target.checked === true){
                data.is_disable = 0;
            }else {
                data.is_disable = 1;
            }
        });
        setItemList(tempList);
    }

    const handleSaveRequest = async (data) => {
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            let itemId = Number(data.item_id);
            let UnitId = Number(data.unit_id);
            let newQuantity = document.getElementById(`newQuantity-${itemId}-${UnitId}`);
            let newCost = document.getElementById(`newCost-${itemId}-${UnitId}`); 
            let comment = document.getElementById(`comment-${itemId}-${UnitId}`); 
            
            if (newQuantity.checkValidity() && newCost.checkValidity() && comment.checkValidity()) {
                const result = await InvoiceAPI.postItemUpdateRequest({itemData: data});
                onChangeHandler({target:{name:`isDisable-${data.item_id}-${data.unit_id}`, checked:false, value: ''}});
            } else {
                alert("Fill all the fields.");
            } 
             
            setIsLoading(false);    
            setIsSubmitting(false);            
        }catch(e){
            console.log('Error...', e);
        }
    }

    const handleCancel = () => {
        window.history.back();
    }
                                            
    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);
        try{
            let formData = [];
            (itemList.length > 0 ? itemList : []).map(data => {
                if(data.is_requested === 1){
                    formData.push(data);
                }
            });
            const result = await InvoiceAPI.postInvoiceUpdateRequest({
                itemList: formData, 
                commonComment: commonComment,
                invoice_version_id: itemList[0].invoice_version_id,
            });
            setIsLoading(false); 
            setIsSubmitting(false);
            handleCancel();
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
                                                        <input type="checkbox" onChange= {handleEnableAll} checked={commonCheckBox} />
                                                    </th>
                                                    <th style={{minWidth : '200px'}} rowSpan={2}>Item</th>
                                                    <th colSpan={3}>Current Value</th>
                                                    <th colSpan={2}>Want to change</th>
                                                    <th style={{minWidth : '200px'}} rowSpan={2}> Comment</th>
                                                    <th style={{minWidth : '130px'}} rowSpan={2}> Action</th>
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
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <input name={"isDisable-"+data.item_id+"-"+data.unit_id} checked={!data.is_disable} type="checkbox" onChange={onChangeHandler} />
                                                                </td>                                                                
                                                                <td>{data.item_name}</td>
                                                                <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                <td>${Number(data.unit_price).toFixed(2)}</td>
                                                                <td>${Number(data.total_amt).toFixed(2)}</td>
                                                                <td>
                                                                    <div class="d-flex justify-content-center">
                                                                        <input type="number" name={"newQuantity-"+data.item_id+"-"+data.unit_id} class="cost-input" id={"newQuantity-"+data.item_id+"-"+data.unit_id}  value={data.new_quantity} min="0" step="0.1" onChange={onChangeHandler} disabled={data.is_disable === 1} required />
                                                                        <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div class="d-flex justify-content-center">
                                                                        <p class="cost-input-adoptment"> $ </p>
                                                                        <input type="number" name={"newCost-"+data.item_id+"-"+data.unit_id} class="cost-input" id={"newCost-"+data.item_id+"-"+data.unit_id} value={data.new_total_amt} min="0" step="0.1" onChange={onChangeHandler} disabled={data.is_disable === 1} required />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <textarea type="text" rows={2} name= {"comment-"+data.item_id+"-"+data.unit_id} id={"comment-"+data.item_id+"-"+data.unit_id} value={data.comment} onChange={onChangeHandler} disabled={data.is_disable === 1} required></textarea>
                                                                </td>
                                                                <td>
                                                                    <button class="alter-purchase-record" style={data.is_disable===1 ? {cursor: 'auto'}: {}} type="button" disabled={data.is_disable === 1} onClick={() => {handleSaveRequest(data)}} > Save Request </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                    <tr>
                                                        <td style={{minWidth : '60px'}}></td>
                                                        <td style={{minWidth : '50px'}}>
                                                            <input type="checkbox" onChange= {handleEnableAll} checked={commonCheckBox} />
                                                        </td>
                                                        <td colSpan={8}></td>
                                                    </tr>
                                                </tbody> 
                                            </table>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <br />
                                                <h5>Common Comment*</h5>                                                
                                                <textarea value={commonComment} onChange={(e)=>{setCommonComment(e.target.value);}} cols="30" rows="10" class="form-control" required ></textarea>
                                            </div>
                                        </div>   
                                        <div class="form-group p-4">
                                            <button class="btn  px-4 btn-primary"  type="submit" disabled={isSubmitting === true} > Send Request </button>
                                            &nbsp;&nbsp;&nbsp;
                                            <button class="btn  px-4 btn-primary"  type="button" onClick={handleCancel}> Cancel </button>
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
