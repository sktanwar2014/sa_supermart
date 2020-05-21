import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import CallLoader from '../../common/Loader.js';


import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';
import {SimpleAlert} from '../../common/Alert.js'

const RESET_VALUES = {
    date : new Date(),
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const userId = APP_TOKEN.get().userId;
    const [isLoading, setIsLoading] = useState(false);
    const [alertParams, setAlertParams] = useState({message:'', variant: 'success', style: {}});
    const [showAlert, setShowAlert] = useState(false);
    
    useEffect(()=>{
		getOrderedProductListSingleDay();		
    },[]);

    const handleEachCostChange = (e) => {
        let id = (e.target.name).split('-')[1];
        let price = Number(e.target.value);        
        const purchasedQuantity = document.getElementById('purchasedQuantity-'+id).value;
        if(purchasedQuantity == 0 || purchasedQuantity == "" || purchasedQuantity== null || purchasedQuantity == undefined || purchasedQuantity == NaN){
            document.getElementById('productCost-'+id).value = 0;
        }else{
            document.getElementById('productCost-'+id).value = (price * Number(purchasedQuantity)).toFixed(2);
        }
    }
    
    const handleCostChange = (e) => {
        let id = (e.target.name).split('-')[1];
        let price = Number(e.target.value);
        const purchasedQuantity = document.getElementById('purchasedQuantity-'+id).value;
        if(purchasedQuantity == 0 || purchasedQuantity == "" || purchasedQuantity== null || purchasedQuantity == undefined || purchasedQuantity == NaN){
            document.getElementById('productCostEach-'+id).value = 0;
        }else{
            document.getElementById('productCostEach-'+id).value = (price / Number(purchasedQuantity)).toFixed(2);
        }
    }
    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderedProductListSingleDay = async () => {
        setIsLoading(true);
        setShowAlert(false);
        setOrderedProductList([]);
        try{
            const result = await OrderAPI.getOrderedProductListSingleDay({
                date : getDate(inputs.date),
            });
            setOrderedProductList(result.orderedProductListSingleDay);   
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handlePurchasedRecord = async () => {
        setIsLoading(true);
        
        try{
            let formData = [];
            (orderedProductList.length > 0 ? orderedProductList : []).map(data => {
                let purchasedQuantity  = document.getElementById('purchasedQuantity-'+data.id).value;
                let productCost  = document.getElementById('productCost-'+data.id).value;
                let costOfEachProduct  = document.getElementById('productCostEach-'+data.id).value;
                formData.push({
                    product_id : data.id,
                    purchase_date : getDate(inputs.date),
                    required_quantity : data.weight,
                    required_unit_id : data.main_unit_id,
                    purchased_quantity : purchasedQuantity,
                    purchased_unit_id : data.main_unit_id,                    
                    cost : productCost,
                    cost_of_each : costOfEachProduct,
                    createdBy : userId,
                })
            });
            if(formData.length > 0){
                const result = await OrderAPI.handlePurchasedRecord({formData: formData});                
                if(result !== "" && result !== null && result !== undefined){
                    setAlertParams({...alertParams, ['message'] : 'Table updated successfully'});
                    setShowAlert(true);
                }
            }
        setIsLoading(false);
        }catch(e){
            console.log(e);
        }
    }

    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>Ordered Products </h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-9">
                                            <div class="form-group">
                                                <label for="date">Date * </label>
                                                <input id="date" name="date" type="date" value={getDate(inputs.date)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        <div class="col-md-3 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderedProductListSingleDay}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100 table-div">
                                            <table className="table table-td">
                                                <thead class="thead-primary">
                                                    <tr class="text-center">
                                                        <th style={{minWidth : '50px'}}>#</th>
                                                        <th style={{minWidth : '200px'}}>Products</th>
                                                        <th style={{minWidth : '150px'}}>Ordered Quantity</th>
                                                        <th>Purchased Quantity</th>                                                        
                                                        <th>Cost of Each </th>
                                                        <th>Cost of Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderedProductList.length>0 ? orderedProductList :[]).map((data, index) => {                                                    
                                                    return(
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{data.product_name}</td>
                                                            <td>{data.weight+ ' ' + data.unit_name}</td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <input type="number" name={"purchasedQuantity-"+data.id} class="cost-input" id={"purchasedQuantity-"+data.id} defaultValue={data.purchased_quantity ? data.purchased_quantity : data.weight}  min="1" disabled={data.purchased_status === 3} />
                                                                    <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <p class="cost-input-adoptment"> $ </p>
                                                                    <input type="number" name={"productCostEach-"+data.id} class="cost-input" id={"productCostEach-"+data.id} defaultValue={data.cost_of_each ? data.cost_of_each : (data.price / data.weight)} min="1"  disabled={data.purchased_status === 3} onChange={handleEachCostChange} />
                                                                </div>
                                                            </td>       
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <p class="cost-input-adoptment"> $ </p>
                                                                    <input type="number" name={"productCost-"+data.id} class="cost-input" id={"productCost-"+data.id} defaultValue={data.cost ? data.cost : data.price} min="1"  disabled={data.purchased_status === 3} onChange={handleCostChange} />
                                                                </div>
                                                            </td>                                                          
                                                        </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>                                        
									</div>
                                    <div class="row">
                                        <div class="col-md-12 m-top">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={handlePurchasedRecord}> Update </button>
                                                </div>
                                            </div>
                                        </div> 
                                    </div> 
                                    <div class="row">
                                        <div class="col-md-12 m-top">
                                            {showAlert ? <SimpleAlert message={alertParams.message} variant={alertParams.variant} style = {{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}/> : ""}
                                        </div> 
                                    </div>                                    
								</div>
							</div>
						</div>
                    
                </div>
    </section>
		<Footer />
        {isLoading ?   <CallLoader />   : null  }
	</Fragment>
    )
}