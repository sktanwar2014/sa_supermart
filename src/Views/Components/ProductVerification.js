import React, {useState, useEffect, Fragment} from 'react';

//Components 
import {APP_TOKEN} from '../../api/config/Constants.js';
import StaticAPI from '../../api/static.js';
import OrderAPI from '../../api/order.js';
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import CallLoader from '../../common/Loader.js';

import {getDate, getDateInDDMMYYYY} from '../../common/moment.js';

export default function DeliveryForm(props) {

    const userId = APP_TOKEN.get().userId;
    const [order, setOrder]  = useState(props.location.state.order);
    const [productList, setProductList] = useState(props.location.state.product);
    const [productUnitList, setProductUnitList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(()=>{
        getProductUnitList();
    },[]);

    const getProductUnitList = async () => {
        try{
            const result = await StaticAPI.getProductUnitList();
            setProductUnitList(result.productUnitList);            
        }catch(e){
            console.log('Error...',e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSubmitting(true);

        try{
            let productData = [];
            productList.map((data)=> {
                productData.push({
                    delivered_id : data.delivered_id,
                    ordered_id : data.id,
                    product_id : data.product_id,
                    quantity : document.getElementById('provideQuantity-'+data.product_id).value,
                    unit_id : data.unit_id,
                })
            })

            const result = await OrderAPI.orderVerificationByCustomer({productData: productData, orderId : order.id});
            setIsLoading(false);

            if(result === true){ // true = inserted
                window.location.pathname = '/view-user-order-list';
            }else{
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
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Order Id: </label>
                                                <div class="d-flex">
                                                    <h6>{order.order_id}</h6>
                                                </div>
                                            </div>
                                        </div>   
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Order Date: </label>
                                                <div class="d-flex">
                                                    <h6>{getDateInDDMMYYYY(order.order_date)}</h6>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Mobile No.: </label>
                                                <div class="d-flex">
                                                    <h6>{order.mobile}</h6>
                                                </div>
                                            </div>
                                        </div>  
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Delivery Date: </label>
                                                <div class="d-flex">
                                                <h6>{getDateInDDMMYYYY(order.delivery_date)}</h6>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="col-md-3">
                                            <div class="form-group">
                                                <label>Customer Name: </label>
                                                <div class="d-flex">
                                                    <h6>{order.full_name}</h6>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="col-md-9">
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
                                                    <th>Received Quantity</th>
                                                    {/* <th>Unit</th> */}
                                                </tr>
                                            </thead>
                                                <tbody>
                                                {(productList.length >0 ? productList :[]).map((data, index) => {
                                                    return(
                                                        <tr>
                                                            <td>{data.product_name}</td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <input type="number" name={"provideQuantity-"+data.product_id} class="cost-input" id={"provideQuantity-"+data.product_id} min="0" step="0.01" required/>
                                                                    <p class="cost-input-adoptment"> {data.delivered_unit_name} </p>
                                                                </div>
                                                            </td>
                                                            {/* <td>
                                                                <select id={"productUnit-"+data.product_id} class="select-verified-product" required>
                                                                    <option  value = "">Select any one</option>
                                                                    {(productUnitList.length > 0 ? productUnitList : [] ).map((data)=>{
                                                                        return(
                                                                            data.is_bundle === 0 ? <option id={data.id} value={data.id} >{data.unit_name}</option> :null
                                                                        )
                                                                    })
                                                                    }
                                                                </select>
                                                            </td> */}
                                                        </tr>
                                                        )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        <div class="form-group p-4">
                                            <input type="submit" value="Submit" class="btn  px-4 btn-primary" disabled={isSubmitting} />
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