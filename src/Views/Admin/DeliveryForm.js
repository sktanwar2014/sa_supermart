import React, {useState, useEffect, Fragment} from 'react';

//Components 
import {APP_TOKEN} from '../../api/config/Constants.js';
import OrderAPI from '../../api/order.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';

import {getDate, getDateInDDMMYYYY} from '../../common/moment.js';
import CallLoader from '../../common/Loader.js';

export default function DeliveryForm(props) {
    
    const userId = APP_TOKEN.get().userId;
    const [order, setOrder]  = useState(props.location.state.order);
    const [productList, setProductList] = useState([]);
    const [noOneAvailable, setNoOneAvailable] = useState([]);
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
            if(result.deliveryFormData.length >0){
                setProductList(result.deliveryFormData);
            }else if(result.deliveryFormData.length === 0){
                alert('Product not available in stock !')
                window.location.pathname = '/view-ordered-product';
            }
            setIsLoading(false);
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handleQuantityChange = (e) => {
        let id =  (e.target.name).split('-')[1];
        let quantity = e.target.value;
        const found = productList.find(ele  => {return ele.id == id});

        let available = (found.paid_quantity !== null && found.paid_quantity !== undefined && found.paid_quantity !== "") ? Number(found.purchased_quantity - found.paid_quantity).toFixed(3) : Number(found.purchased_quantity).toFixed(3) ;
        if(Number(available) < Number(quantity)){
            document.getElementById('provideQuantity-'+id).value = '';            
            alert('input quantity is out of stock');
        }else{
            let price = (found.cost / found.purchased_quantity) * quantity ;
            document.getElementById('productPrice-'+id).textContent = Number(price).toFixed(2);
        }
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
                if(data.purchased_quantity  !== null){
                    productData.push({
                        ordered_id : data.id,
                        product_id : data.product_id,
                        delivery_date : getDate(new Date()),
                        order_date : getDate(order.order_date),
                        paid_quantity : document.getElementById('provideQuantity-'+data.id).value,
                        unit_id : data.purchased_unit_id,
                        price : document.getElementById('productPrice-'+data.id).textContent,
                        created_by : userId,
                    })
                }
            })
            const result = await OrderAPI.submitDeliveryDetails({productData: productData, orderId : order.id});
            setIsLoading(false);            
            if(result === true){    // true = inserted
                window.location.pathname = '/view-order-list';
            }else{
                setIsSubmitting(false);
                alert('Failed Insertion');
            } 
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
                                            <h5>Product List</h5>
                                        </div>
                                        <table className="unit-array-table table-min-width">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Demand</th>
                                                    <th>Available in Stock</th>
                                                    <th>Given Quantity</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                                <tbody>
                                                    {(productList.length >0 ? productList :[]).map((data, index) => {    
                                                        let available =  
                                                            (data.purchased_quantity  === null) ? 0.00 : 
                                                            (data.paid_quantity !== null && data.paid_quantity !== undefined && data.paid_quantity !== "") ?
                                                            Number(data.purchased_quantity - data.paid_quantity).toFixed(3) : Number(data.purchased_quantity).toFixed(3)
                                                    return(
                                                        <tr>
                                                            <td>{data.product_name}</td>
                                                            <td>{data.quantity+ ' ' + data.ordered_unit_name}</td>
                                                            <td>{
                                                                (available > 0 )  ? available + " " + data.purchased_unit_name
                                                                : "Not available"
                                                                // (data.purchased_quantity  === null) ? "Not available" :
                                                                // (data.paid_quantity !== null && data.paid_quantity !== undefined && data.paid_quantity !== "") ?
                                                                // Number(data.purchased_quantity - data.paid_quantity).toFixed(3) + ' ' + data.purchased_unit_name : Number(data.purchased_quantity).toFixed(3)  + ' ' + data.purchased_unit_name
                                                            }</td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <input type="number" name={"provideQuantity-"+data.id} class="cost-input" id={"provideQuantity-"+data.id} min="0" step="0.01" onChange={handleQuantityChange} required disabled={(available <= 0) }/>
                                                                    {(available > 0) ? <p class="cost-input-adoptment"> {data.purchased_unit_name} </p> :''}
                                                                    {/* <p class="cost-input-adoptment"> {data.ordered_unit_name} </p> */}
                                                                    {/* <select id="provideUnit"  class="delivery-unit-select" defaultValue={data.unit_id}  required>
                                                                        <option  value = {data.purchased_unit_id}>{data.purchased_unit_name}</option>
                                                                    </select> */}
                                                                </div>
                                                            </td>
                                                            <td><p  id={"productPrice-"+data.id} ></p></td>
                                                        </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                            <div class="form-group p-4">
                                                {((productList.find(ele => {return ele.purchased_quantity !== null && (ele.purchased_quantity - ele.paid_quantity > 0)})) ===  undefined) 
                                                    ?   <input type="button" value="Go Back" class="btn  px-4 btn-primary" onClick={handleGoBack}/>
                                                    :   <input type="submit" value="Submit" class="btn  px-4 btn-primary" disabled={isSubmitting} />
                                                }
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