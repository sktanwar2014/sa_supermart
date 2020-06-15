import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import CallLoader from '../../common/Loader.js';
import ProductSelectionDialog from './Components/productSelectionDialog.js';

import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';
import {SimpleAlert} from '../../common/Alert.js'
import {isNotEmpty} from '../../utils/conditionChecker.js';


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
    const [productSelectionDialog, setProductSelectionDialog] = useState(false);
    
    useEffect(()=>{
		getOrderedProductListSingleDay();
    },[]);

    

    const getOrderedProductListSingleDay = async () => {
        setIsLoading(true);
        setShowAlert(false);
        setOrderedProductList([]);
        try{
            const result = await OrderAPI.getOrderedProductListSingleDay({
                date : getDate(inputs.date),
            });            
            let temp = [...result.orderedProductListSingleDay];
            (temp.length > 0 ? temp : []).map(data => {
                data.add_remove = 0;
                data.break_here = 0;
                data.purchased_quantity = data.purchased_quantity ? data.purchased_quantity : data.quantity;
                data.productCostEach = data.cost_of_each ? data.cost_of_each : (data.price / data.quantity);
                data.productCost = data.cost ? data.cost : data.price;
            });
            temp.push({break_here: 1});
            setOrderedProductList(temp);
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    const onChangeHandler = (e) => {
        let name = (e.target.name).split('-')[0];
        let id = Number((e.target.name).split('-')[1]);
        let value = e.target.value;
        let tempList = [...orderedProductList];
        tempList.map((data) => {
            if(data.id === id){
                if(name === "purchased_quantity"){
                    data.purchased_quantity = value;
                    if(value){
                        if(data.productCostEach){
                            data.productCost = (Number(data.productCostEach) * Number(value)).toFixed(2);
                        }else if(data.productCost){
                            data.productCostEach = (Number(data.productCost) / Number(value)).toFixed(2);
                        }else{
                            data.productCost = 0;
                            data.productCostEach = 0;
                        }
                    }else{
                        data.productCost = 0;
                        data.productCostEach = 0;
                    }                    
                }else if(name === "productCostEach"){
                    data.productCostEach = value;
                    if(data.purchased_quantity){
                        data.productCost = (Number(value) * Number(data.purchased_quantity)).toFixed(2);
                    }else {
                        data.productCost = 0;
                    }
                }else if(name === "productCost"){
                    data.productCost = value;
                    if(data.purchased_quantity){
                        data.productCostEach = (Number(value) / Number(data.purchased_quantity)).toFixed(2);
                    }else{
                        data.productCostEach = 0;
                    }
                }
              }
        });
        setOrderedProductList(tempList);
    }

	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const handleProductSelection = (product) => {
        if(!(orderedProductList.find(ele => ele.id === product.id))){
            let temp = [...orderedProductList];
            temp.push({
                break_here:  0,
                is_extra : 1,
                cost: '',
                cost_of_each: '',
                id: product.id,
                main_unit_id: product.main_unit_id,
                price: product.price,
                product_name: product.product_name,
                purchased_quantity: "",
                productCostEach :"",
                productCost : "",
                purchased_status: "",
                purchased_unit_id: "",
                unit_name: product.main_unit_name,
                quantity: 0,
                add_remove: 1,
            });
            setOrderedProductList(temp);    
        }
        setProductSelectionDialog(false);
    }

    const handlePurchasedRecord = async (e) => {
        e.preventDefault();
        setIsLoading(true);        
        try{
            let formData = [];
            (orderedProductList.length > 0 ? orderedProductList : []).map(data => {
                if(data.break_here === 0){
                    formData.push({
                        product_id : data.id,
                        purchase_date : getDate(inputs.date),
                        required_quantity : data.quantity,
                        required_unit_id : data.main_unit_id,
                        purchased_quantity : data.purchased_quantity,
                        purchased_unit_id : data.main_unit_id,
                        cost : data.productCost,
                        cost_of_each : data.productCostEach,
                        createdBy : userId,
                        is_extra : data.is_extra,
                    });
                }
            });
            if(formData.length > 0){
                const result = await OrderAPI.handlePurchasedRecord({formData: formData});                
                if(isNotEmpty(result)){
                    setAlertParams({...alertParams, ['message'] : 'Table updated successfully'});
                    setShowAlert(true);
                }
            }
            getOrderedProductListSingleDay();
            setIsLoading(false);
        }catch(e){
            console.log(e);
        }
    }

    const removeAdditionalProduct = async (index) => {
        let temp = [...orderedProductList];
        temp.splice(index,1);
        setOrderedProductList(temp);
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
                                {/* <form onSubmit={handlePurchasedRecord}> */}
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
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderedProductList.length>0 ? orderedProductList :[]).map((data, index) => {
                                                        if(data.break_here === 1){
                                                            return(
                                                                <tr>
                                                                    <td colSpan={7}>
                                                                        Additional Purchases
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }else{
                                                            return(                                                        
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{data.product_name}</td>
                                                                    <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                    <td>
                                                                        <div class="d-flex justify-content-center">
                                                                            <input type="number" name={"purchased_quantity-"+data.id} class="cost-input" id={"purchased_quantity-"+data.id}  value={data.purchased_quantity}  min="0" disabled={data.purchased_status === 3} required onChange={onChangeHandler} />
                                                                            <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div class="d-flex justify-content-center">
                                                                            <p class="cost-input-adoptment"> $ </p>
                                                                            <input type="number" name={"productCostEach-"+data.id} class="cost-input" id={"productCostEach-"+data.id} value={data.productCostEach} min="0"  disabled={data.purchased_status === 3} onChange={onChangeHandler} required/>
                                                                        </div>
                                                                    </td>       
                                                                    <td colSpan={data.add_remove === 0 ? 2 : 0}>
                                                                        <div class="d-flex justify-content-center">
                                                                            <p class="cost-input-adoptment"> $ </p>
                                                                            <input type="number" name={"productCost-"+data.id} class="cost-input" id={"productCost-"+data.id} value={data.productCost}  min="0"  disabled={data.purchased_status === 3} onChange={onChangeHandler} required />
                                                                        </div>
                                                                    </td>  
                                                                    {data.add_remove === 1 && <td class="product-remove"><a onClick={() => {removeAdditionalProduct(index)}}><span class="ion-ios-close"></span></a></td>}
                                                                </tr>
                                                                )
                                                            }
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
                                                    <button class="btn btn-primary px-4 mx-3" onClick={() => {setProductSelectionDialog(true)}}> Add Extra Purchase </button> 
                                                    <button type="submit" class="btn btn-primary px-4" onClick={handlePurchasedRecord}> Update </button> 
                                                </div>
                                            </div>
                                        </div> 
                                    </div> 
                                    {/* </form> */}
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
        {productSelectionDialog ? <ProductSelectionDialog open={productSelectionDialog} setProductSelectionDialog = {setProductSelectionDialog} handleProductSelection={handleProductSelection} /> : null}
	</Fragment>
    )
}