import React, {useState, useEffect, Fragment} from 'react';
import { isNullOrUndefined } from 'util';
//Components 
import {APP_TOKEN} from '../../api/config/Constants.js';
import OrderAPI from '../../api/order.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';

import {getDate, getDateInDDMMYYYY} from '../../common/moment.js';
import CallLoader from '../../common/Loader.js';
import { isNotEmpty } from '../../utils/conditionChecker.js';

export default function DeliveryForm(props) {
    const userId = APP_TOKEN.get().userId;
    const [order, setOrder]  = useState(props.location.state.order);
    const [productList, setProductList] = useState([]);
    const [extraPurchased, setExtraPurchased] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [purchasedStock, setPurchasedStock] = useState([]);
    const [extraStock, setExtraStock] = useState([]);
    

    useEffect(()=>{
        fetchDeliveryFormData();
    },[]);

    const fetchDeliveryFormData = async () => {
        setIsLoading(true);
        try{
            const result = await OrderAPI.fetchDeliveryFormData({
                orderId : order.id,
                order_date : getDate(order.order_date),
            });
            // console.log(result);
            let temp = [...result.deliveryFormData];
            let temp2 = [...result.extraPurchased];
            let purchasedStock = [];
            let extraStock = [];

            temp.map((data) => {
                let purchased_unit_id =  !(isNullOrUndefined(data.purchased_unit_id)) ? Object.values((data.purchased_unit_id).split(',')) : [];
                let purchased_quantity = !(isNullOrUndefined(data.purchased_quantity)) ? Object.values((data.purchased_quantity).split(',')) : [];
                let purchased_unit_name = !(isNullOrUndefined(data.purchased_unit_name)) ? Object.values((data.purchased_unit_name).split(',')) : [];
                let cost = !(isNullOrUndefined(data.cost)) ? Object.values((data.cost).split(',')) : [];
                let available_quantity = !(isNullOrUndefined(data.available)) ? Object.values((data.available).split(',')) : [];

                purchased_unit_id.map((unit, index) => {
                    if(Number(available_quantity[index]) !== 0){
                        purchasedStock.push({
                            product_id : Number(data.product_id),
                            unit_id : Number(unit),
                            quantity : Number(purchased_quantity[index]),
                            unit_name : purchased_unit_name[index],
                            cost : Number(cost[index]),
                            cost_of_each : Number(cost[index]) / Number(purchased_quantity[index]),
                            available_quantity : Number(available_quantity[index]),
                        });
                    }
                    
                    if(Number(unit) === data.unit_id){
                        if(data.quantity<= available_quantity[index]){
                            data.will_give = data.quantity;
                            data.price = (Number(cost[index]) / Number(purchased_quantity[index])) * Number(data.quantity);
                            data.selected_unit_id = data.unit_id;
                        }else{
                            data.will_give = '';
                            data.price = 0;
                            data.selected_unit_id = data.unit_id;
                        }
                    }
                });
            });
            let uniqueExtras = [];
            temp2.map((data) => {
                let extras = temp.find(e => {return e.product_id === data.product_id});
                if(isNullOrUndefined(extras)){
                    let purchased_unit_id =  !(isNullOrUndefined(data.purchased_unit_id)) ? Object.values((data.purchased_unit_id).split(',')) : [];
                    let purchased_quantity = !(isNullOrUndefined(data.purchased_quantity)) ? Object.values((data.purchased_quantity).split(',')) : [];
                    let purchased_unit_name = !(isNullOrUndefined(data.purchased_unit_name)) ? Object.values((data.purchased_unit_name).split(',')) : [];
                    let cost = !(isNullOrUndefined(data.cost)) ? Object.values((data.cost).split(',')) : [];
                    let cost_of_each = !(isNullOrUndefined(data.cost_of_each)) ? Object.values((data.cost_of_each).split(',')) : [];
                    let available_quantity = !(isNullOrUndefined(data.available)) ? Object.values((data.available).split(',')) : [];
    
                    purchased_unit_id.map((unit, index) => {
                        if(Number(available_quantity[index]) !== 0){
                            extraStock.push({
                                product_id : Number(data.product_id),
                                unit_id : Number(unit),
                                quantity : Number(purchased_quantity[index]),
                                unit_name : purchased_unit_name[index],
                                cost : Number(cost[index]),
                                cost_of_each : Number(cost_of_each[index]),
                                available_quantity : Number(available_quantity[index]),
                            });
                        }
                    });
                    uniqueExtras.push(data);
                }
            });
            
            setPurchasedStock(purchasedStock);
            setExtraStock(extraStock);
            temp.push({break_here: 1});
            setProductList(temp);
            setExtraPurchased(uniqueExtras);
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }
    

    const handleQuantityChange = (e) => {
        let id =  (e.target.name).split('-')[1];
        let quantity = document.getElementById('provideQuantity-'+id).value;
        let unit = document.getElementById('unitSelection-'+id).value;

        let tempProd = [...productList];
        tempProd.map((data) => {
            if(data.product_id === Number(id)){
                let stock = purchasedStock.find(e => {return e.product_id === data.product_id && e.unit_id === Number(unit)});

                if(unit !== "" && quantity !== ""){
                    if(Number(quantity) <= stock.available_quantity){
                        data.will_give = Number(quantity);
                        data.price = ((stock.cost / stock.quantity) * Number(quantity)).toFixed(2);
                        data.selected_unit_id = unit;
                    }else{
                        data.will_give = "";
                        data.price = 0;                        
                        alert('input quantity is out of stock');
                    }
                }else if(unit === ""){
                    data.will_give = Number(quantity);
                    data.price = 0;
                    data.selected_unit_id = "";
                }else if(quantity === ""){
                    data.will_give = "";
                    data.price = 0;
                }
            }
        })
        setProductList(tempProd);
    }

    const handleGoBack = (e) => {
        window.location.pathname = '/view-order-list';
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);

        try{
            let productData = [];
            productList.map((data) => {
                if(isNullOrUndefined(data.break_here)){
                    if(Number(data.will_give) !== 0){
                        productData.push({
                            order_id : order.id,
                            ordered_id : data.id,
                            product_id : data.product_id,
                            tracking_id : data.tracking_id !== "" ? data.tracking_id : `O${order.id}P${data.product_id}U${data.selected_unit_id}-${Math.floor(Math.random()*10000)}`,
                            delivery_date : getDate(new Date()),
                            order_date : getDate(order.order_date),
                            paid_quantity : data.will_give,
                            unit_id : data.selected_unit_id,
                            price : data.price,
                        })
                    }
                } 
            });
            // console.log(productData)
            const result = await OrderAPI.submitDeliveryDetails({productData: productData, orderId : order.id});
            setIsLoading(false);    
            setIsSubmitting(false);
            if(result === true){    // true = inserted
                window.location.pathname = '/view-order-list';
            }else{
                alert('Failed Insertion');
            }
        }catch(e){
            console.log('Error...', e);
        }
    }

    const extraSelectionHandler = (data) =>{
        let isExist = productList.find(ele => ele.product_id === data.product_id);        
        if(!(isExist)){
            let temp = [...productList];
            temp.push({
                id : 0,
                product_id : data.product_id,                
                tracking_id : '',
                product_name: data.product_name,
                quantity : '',
                purchased_unit_id : data.purchased_unit_id,
                ordered_unit_name : data.purchased_unit_name,
                purchased_quantity : data.purchased_quantity,
                purchased_unit_name: data.purchased_unit_name,
                paid_quantity : data.paid_quantity,
                cost : data.cost,
                add_remove : 1,
            });
            setProductList(temp);
            
            let isUnitExist = purchasedStock.filter(e => {return e.product_id === data.product_id});
            if(isUnitExist.length === 0){
                let tempUnits = [...purchasedStock];
                let units = extraStock.map((e) => {
                    if(e.product_id === data.product_id){
                        tempUnits.push({
                            product_id : e.product_id,
                            unit_id : e.unit_id,
                            quantity : e.quantity,
                            unit_name : e.unit_name,
                            cost : e.cost,
                            cost_of_each : e.cost_of_each,
                            available_quantity : e.available_quantity,
                        });
                    }
                });
                setPurchasedStock(tempUnits);
            }
        }
    }

    const removeAdditionalProduct = async (index) => {
        let temp = [...productList];
        temp.splice(index,1);
        setProductList(temp);
    }
    

    return(
    <Fragment>
        <Header />
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <h3 class="mb-4 billing-heading">Delivery Form</h3>
                            <form onSubmit={handleSubmit} class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Order Id: </label>
                                                <div class="d-flex">
                                                    <h6>{order.order_id}</h6>
                                                </div>
                                            </div>
                                        </div>   
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Order Date: </label>
                                                <div class="d-flex">
                                                    <h6>{getDateInDDMMYYYY(order.order_date)}</h6>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Mobile No.: </label>
                                                <div class="d-flex">
                                                    <h6>{order.mobile}</h6>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label>Customer Name: </label>
                                                <div class="d-flex">
                                                    <h6>{order.full_name}</h6>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="col-md-8">
                                            <div class="form-group">
                                                <label>Address: </label>
                                                <div class="d-flex">
                                                    <h6>{order.flat_add + ', ' + order.street_add + ', ' + order.city + ', ' + order.state + ' - ' + order.pincode}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12"> <hr /> </div>
                                        <div class="col-md-12">
                                            <h5>Ordered Product List</h5>
                                        </div>
                                        <div class="w-100 table-div">
                                            <table className="table table-td">
                                                <thead className="thead-primary">
                                                    <tr className="text-center">
                                                        <th style={{minWidth : '250px'}}>Product</th>
                                                        <th style={{minWidth : '100px'}}>Demand</th>
                                                        <th style={{minWidth : '150px'}}>Available in Stock</th>
                                                        <th style={{minWidth : '150px'}}>Given Quantity</th>
                                                        <th style={{minWidth : '150px'}}>Price</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                    <tbody >
                                                        {(productList.length >0 ? productList :[]).map((data, index) => {    
                                                            let units = purchasedStock.filter(e => { return (e.product_id == data.product_id)});
                                                            if(data.break_here === 1){
                                                                return(
                                                                    <tr>
                                                                        <td colSpan={6}>
                                                                            Extra Products for Delivery
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }else{
                                                                return(
                                                                    <tr>
                                                                        <td>{data.product_name}</td>
                                                                        <td>{data.quantity+ ' ' + data.ordered_unit_name}</td>
                                                                        <td>{(isNotEmpty(units)) &&
                                                                                units.map((row, index) => {
                                                                                return( row.available_quantity + '  ' + row.unit_name + ', ' )
                                                                            })}
                                                                        </td>
                                                                        <td>
                                                                            <div class="d-flex">
                                                                                <input type="number" name={"provideQuantity-"+data.product_id} value={data.will_give} class="cost-input" id={"provideQuantity-"+data.product_id} min="0" step="0.01" onChange={handleQuantityChange} required disabled={units.length === 0} />
                                                                                <select id={"unitSelection-" + data.product_id}  name={"unitSelection-" + data.product_id} class="cost-input" required={Number(data.will_give) !== 0} onChange={handleQuantityChange} disabled={units.length === 0}>
                                                                                    <option  value = "">Select Any One</option>
                                                                                        {(units.length > 0 ? units : [] ).map((unit, index)=>{
                                                                                        return(
                                                                                            <option id={unit.unit_id} value={unit.unit_id} selected = {unit.unit_id === data.unit_id} >{unit.unit_name}</option>
                                                                                        )
                                                                                        })}
                                                                                </select>
                                                                            </div>
                                                                        </td>
                                                                        <td colSpan={!(data.add_remove === 1) ? 2 : 0}>
                                                                            <p  id={"productPrice-"+data.product_id} >{data.price}</p>
                                                                        </td>
                                                                        {data.add_remove === 1 && 
                                                                            <td class="product-remove">
                                                                                <a onClick={() => {removeAdditionalProduct(index)}}>
                                                                                    <span class="ion-ios-close"></span>
                                                                                </a>
                                                                            </td>
                                                                        }
                                                                    </tr>
                                                                )
                                                            }
                                                        })}
                                                    </tbody>
                                                </table>                                               
                                            </div>
                                            <div class="form-group p-4">
                                                {(productList.find(p => {let stock = purchasedStock.filter(s => {return s.product_id === p.product_id}); return stock.length > 0}) === undefined)
                                                    ?   <input type="button" value="Go Back" class="btn  px-4 btn-primary" onClick={handleGoBack}/>
                                                    :   <input type="submit" value="Submit" class="btn  px-4 btn-primary" disabled={isSubmitting} />
                                                }
                                            </div>
                                    </div>
                                    <div class="col-md-12"> <hr /> </div>
                                    <div class="col-md-12">
                                        <h5>Extra Purchased Products</h5>
                                    </div>
                                    <div class="w-100 table-div">
                                        <table className="table table-td">
                                            <thead className="thead-primary">
                                                <tr className="text-center">
                                                    <th style={{minWidth : '350px'}}>Product</th>
                                                    <th style={{minWidth : '250px'}}>Available in Stock</th>
                                                    <th style={{minWidth : '200px'}}>Cost</th>
                                                    <th style={{minWidth : '80px'}}>&nbsp;</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(extraPurchased.length >0 ? extraPurchased :[]).map((data, index) => {    
                                                    let units = extraStock.filter(e => { return (e.product_id == data.product_id)});
                                                    if(units.length > 0){
                                                        return(
                                                            <tr>
                                                                <td>{data.product_name}</td>
                                                                <td>{(isNotEmpty(units)) &&
                                                                        units.map((row, index) => {
                                                                        return( row.available_quantity + '  ' + row.unit_name + ', ' )
                                                                    })}
                                                                </td>
                                                                <td>{(isNotEmpty(units)) &&
                                                                       units.map((row, index) => {
                                                                       return( (row.cost_of_each * row.quantity) + ', ')
                                                                    })}
                                                                </td>
                                                                <td class="product-remove"><a onClick={()=>{extraSelectionHandler(data)}}><span>+</span></a></td>                                                     
                                                            </tr>
                                                        )
                                                    }
                                                
                                                })
                                            }
                                            </tbody>
                                        </table>
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