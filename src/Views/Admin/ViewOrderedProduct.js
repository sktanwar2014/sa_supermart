import React, {useState, useEffect, Fragment} from 'react';
import 'util';
//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from '../../api/config/Constants.js';
import CallLoader from '../../common/Loader.js';
import ProductSelectionDialog from './Components/productSelectionDialog.js';
import DialogChooseAdditionalUnit from './Components/DialogChooseAdditionalUnit.js';

import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';
import {SimpleAlert} from '../../common/Alert.js'
import {isNotEmpty} from '../../utils/conditionChecker.js';
import { isNullOrUndefined } from 'util';


const RESET_VALUES = {
    date : new Date(),
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [prodIds, setProdIds] =  useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const userId = APP_TOKEN.get().userId;
    const [isLoading, setIsLoading] = useState(false);
    const [alertParams, setAlertParams] = useState({message:'', variant: 'success', style: {}});
    const [showAlert, setShowAlert] = useState(false);
    const [productSelectionDialog, setProductSelectionDialog] = useState(false);
    const [openAddUnitDialog, setOpenAddUnitDialog] = useState(false);
    const [product, setProduct] = useState({});
    const [existUnit, setExistUnit] = useState([]);
    
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
            // console.log(result)
            setProdIds([...new Set(result.orderedProductListSingleDay.map(dist => dist.id))]);
            let temp = [...result.orderedProductListSingleDay];
            
            (temp.length > 0 ? temp : []).map(data => {
                data.add_remove = 0;
                data.break_here = 0;
                data.purchased_quantity = data.purchased_quantity === "" ? data.quantity : data.purchased_quantity;
                data.productCostEach = data.cost_of_each === "" ? isNaN(data.price_per_unit) ? 0 : (data.price_per_unit ) : data.cost_of_each;
                data.productCost = data.cost === "" ? isNaN(data.price_per_unit * data.quantity) ? 0 : (data.price_per_unit * data.quantity) : data.cost;
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
        let UnitId = Number((e.target.name).split('-')[2]);
        let value = e.target.value;
        let tempList = [...orderedProductList];
        tempList.map((data) => {
            if(data.id === id && data.unit_id === UnitId){
                if(name === "purchased_quantity"){
                    data.purchased_quantity = value;
                    if(value && value != 0){
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
        console.log(product)
        if(!(orderedProductList.find(ele => ele.id === product.id))){
            let temp = [...orderedProductList];
            temp.push({
                break_here:  0,
                is_extra : 1,
                cost: '',
                cost_of_each: '',
                id: product.id,
                main_unit_id: product.main_unit_id,
                unit_id: product.main_unit_id,
                price: product.price,
                price_per_unit: product.price_per_unit,
                product_name: product.product_name,
                purchased_quantity: 1,
                productCostEach : (isNaN(product.price_per_unit) || isNullOrUndefined(product.price_per_unit)) ? 0 : product.price_per_unit,
                productCost : (isNaN(product.price_per_unit) || isNullOrUndefined(product.price_per_unit)) ? 0 : product.price_per_unit,
                purchased_status: "",
                purchased_unit_id: "",
                unit_name: product.main_unit_name,
                main_unit_name: product.main_unit_name,
                quantity: 0,
                add_remove: 1,
            });
            setProdIds([...new Set(temp.map(dist => dist.id))]);
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
                if(data.break_here === 0 && Number(data.purchased_status) !== 3){
                    formData.push({
                        product_id : data.id,
                        purchase_date : getDate(inputs.date),
                        required_quantity : data.quantity,
                        required_unit_id : data.unit_id,
                        purchased_quantity : data.purchased_quantity,
                        purchased_unit_id : data.unit_id,
                        cost : data.productCost,
                        cost_of_each : data.productCostEach,
                        createdBy : userId,
                        is_extra : data.is_extra,
                    });
                }
            });
            // console.log(formData)
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

    const removeAdditionalProduct = async (data) => {
        let temp = [...orderedProductList];
        let foundIndex = (orderedProductList).findIndex(ele => {return ele.id === data.id && ele.unit_id === data.unit_id});
        temp.splice(foundIndex,1);
        setOrderedProductList(temp);
    }
    
    const handleOpenAddUnitDialog = (product, existUnit) => {
        setProduct(product);
        setExistUnit(existUnit);
        setOpenAddUnitDialog(true);        
    }

    const handleCloseAddUnitDialog = (newUnit) => {
        setOpenAddUnitDialog(false);
        let temp = [...orderedProductList];
        setOrderedProductList([]);        
        temp.push(newUnit);
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
                                                        <th style={{minWidth : '150px'}}>Products</th>
                                                        <th style={{minWidth : '100px'}}>Ordered Quantity</th>
                                                        <th style={{minWidth : '150px'}}>Purchased Quantity</th>
                                                        <th style={{minWidth : '200px'}}>Cost of Each </th>
                                                        <th style={{minWidth : '200px'}}>Cost of Total</th>
                                                        <th style={{minWidth : '70px'}}>Action</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(prodIds.length > 0 ? prodIds : []).map((prodId, index) => {
                                                        let matchedProd = (orderedProductList.filter(ele => ele.id === prodId));                                                        
                                                        let rowSpanNo = isNotEmpty(matchedProd) ? matchedProd.length : 0;
                                                        let existUnit = [...new Set(matchedProd.map(dist => dist.unit_id))];

                                                        return (matchedProd.length > 0 ? matchedProd :[]).map((data) => {
                                                            if(data.break_here === 1){
                                                                return(
                                                                    <tr>
                                                                        <td colSpan={8}>
                                                                            Additional Purchases
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }else{
                                                                return(                                                        
                                                                    <tr>
                                                                        {rowSpanNo !== 0 && <td rowSpan={rowSpanNo} >{index + 1}</td>}
                                                                        {rowSpanNo !== 0 && <td rowSpan={rowSpanNo} >{data.product_name}</td>}
                                                                        <td>{data.quantity+ ' ' + data.unit_name}</td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <input type="number" name={"purchased_quantity-"+data.id+"-"+data.unit_id} class="cost-input" id={"purchased_quantity-"+data.id}  value={data.purchased_quantity}  min="0" disabled={data.purchased_status === 3} required onChange={onChangeHandler} />
                                                                                <p class="cost-input-adoptment"> {data.unit_name} </p>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <p class="cost-input-adoptment"> $ </p>
                                                                                <input type="number" name={"productCostEach-"+data.id+"-"+data.unit_id} class="cost-input" id={"productCostEach-"+data.id} value={data.productCostEach} min="0"  disabled={data.purchased_status === 3} onChange={onChangeHandler} required/>
                                                                            </div>
                                                                        </td>       
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <p class="cost-input-adoptment"> $ </p>
                                                                                <input type="number" name={"productCost-"+data.id+"-"+data.unit_id} class="cost-input" id={"productCost-"+data.id} value={data.productCost}  min="0"  disabled={data.purchased_status === 3} onChange={onChangeHandler} required />
                                                                            </div>
                                                                        </td>  
                                                                        {rowSpanNo !== 0 && <td rowSpan={rowSpanNo} colSpan={data.add_remove === 0 ? 2 : 0} >                                                                            
                                                                                <button className = "add-extra-unit" onClick= {() => {handleOpenAddUnitDialog(data, existUnit)}}> Add more</button>
                                                                        </td>}
                                                                        {data.add_remove === 1 && <td class="product-remove"><a onClick={() => {removeAdditionalProduct(data)}}><span class="ion-ios-close"></span></a></td>}
                                                                        <p style={{display:'none'}}> {rowSpanNo = 0}</p>
                                                                    </tr>
                                                                    )
                                                                }
                                                                
                                                            })
                                                    })}
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
        {openAddUnitDialog ? <DialogChooseAdditionalUnit open={openAddUnitDialog} setOpenAddUnitDialog = {setOpenAddUnitDialog} handleCloseAddUnitDialog={handleCloseAddUnitDialog} product = {product} existUnit = {existUnit} /> : null}
	</Fragment>
    )
}