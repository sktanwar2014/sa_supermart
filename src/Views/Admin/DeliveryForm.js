import React, {useState, useEffect, Fragment} from 'react';

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
            let temp = [...result.deliveryFormData];
            temp.push({break_here: 1});
            setProductList(temp);
            setExtraPurchased(result.extraPurchased);
            // if(result.deliveryFormData.length >0){
            //     setProductList(result.deliveryFormData);
            // }
            // else if(result.deliveryFormData.length === 0){
            //     alert('Product not available in stock !')
            //     window.location.pathname = '/view-ordered-product';
            // }
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handleQuantityChange = (e) => {
        let tempProd = [...productList];
        let id =  (e.target.name).split('-')[1];
        let quantity = e.target.value;
        tempProd.map((data) => {
            if(data.product_id == id){
                let available = (isNotEmpty(data.paid_quantity)) ? Number(data.purchased_quantity - data.paid_quantity).toFixed(3) : Number(data.purchased_quantity).toFixed(3) ;
                if(Number(available) < Number(quantity)){
                    data.will_give = '';
                    data.price = '';
                    alert('input quantity is out of stock');
                }else{
                    let price = (data.cost / data.purchased_quantity) * quantity ;
                    data.price = Number(price).toFixed(2);
                    data.will_give = quantity;
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
            productList.map((data, index)=> {
                if(isNotEmpty(data.purchased_quantity)){
                    productData.push({
                        order_id : order.id,
                        ordered_id : data.id,
                        product_id : data.product_id,
                        delivery_date : getDate(new Date()),
                        order_date : getDate(order.order_date),
                        paid_quantity : data.will_give,
                        unit_id : data.purchased_unit_id,
                        price : data.price,
                        created_by : userId,
                    })
                }
            })
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
                product_name: data.product_name,
                quantity : 0,
                purchased_unit_id : data.purchased_unit_id,
                ordered_unit_name : data.purchased_unit_name,
                purchased_quantity : data.purchased_quantity,
                purchased_unit_name: data.purchased_unit_name,
                paid_quantity : data.paid_quantity,
                cost : data.cost,
                add_remove : 1,
            });
            setProductList(temp);
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
                                                            let available =  
                                                                (data.purchased_quantity  === null) ? 0.00 : 
                                                                (isNotEmpty(data.paid_quantity)) ?
                                                                Number(data.purchased_quantity - data.paid_quantity).toFixed(3) : Number(data.purchased_quantity).toFixed(3)
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
                                                                        <td>
                                                                            {(available > 0 )  ? available + " " + data.purchased_unit_name: "Not available"}
                                                                        </td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <input type="number" name={"provideQuantity-"+data.product_id} value={data.will_give} class="cost-input" id={"provideQuantity-"+data.product_id} min="0" step="0.01" onChange={handleQuantityChange} required disabled={(available <= 0) }/>
                                                                                {(available > 0) ? <p class="cost-input-adoptment"> {data.purchased_unit_name} </p> :''}                                                                    
                                                                            </div>
                                                                        </td>
                                                                        <td colSpan={!(data.add_remove === 1) ? 2 : 0}><p  id={"productPrice-"+data.product_id} >{data.price}</p></td>
                                                                        {data.add_remove === 1 && <td class="product-remove"><a onClick={() => {removeAdditionalProduct(index)}}><span class="ion-ios-close"></span></a></td>}
                                                                        
                                                                    </tr>
                                                                    )
                                                            }
                                                        })
                                                    }
                                                    </tbody>
                                                </table>                                               
                                            </div>
                                            <div class="form-group p-4">
                                                {((productList.find(ele => {return ele.purchased_quantity !== null && (ele.purchased_quantity - ele.paid_quantity > 0)})) ===  undefined) 
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
                                                    let available =  
                                                        (data.purchased_quantity  === null) ? 0.00 : 
                                                        (isNotEmpty(data.paid_quantity)) ?
                                                        Number(data.purchased_quantity - data.paid_quantity).toFixed(3) : Number(data.purchased_quantity).toFixed(3)
                                                return(
                                                    <tr>
                                                        <td>{data.product_name}</td>                                                        
                                                        <td>
                                                            {(available > 0 )  ? available + " " + data.purchased_unit_name : "Not available"}
                                                        </td>
                                                        <td>
                                                            {data.cost_of_each * available}
                                                        </td>
                                                        <td class="product-remove"><a onClick={()=>{extraSelectionHandler(data)}}><span>+</span></a></td>                                                     
                                                    </tr>
                                                    )
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