import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../../Partials/Header.js';
import Footer from '../../Partials/Footer.js';
import StaticAPI from '../../../api/static.js';
import OrderAPI from '../../../api/order.js';
import OrderAcceptRejectDialog from '../Components/OrderAcceptRejectDialog.js';

import {getDateInDDMMYYYY, getDate} from '../../../common/moment.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    orderStatus : '1',
}


export default function ViewOrder() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [orderStatusList, setOrderStatusList]  = useState([]);
    const [orderStatus, setOrderStatus] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [orderProps, setOrderProps] = useState({});


    useEffect(()=>{
		getOrderList();		
		getOrderStatusList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderList = async () => {
        setOrderStatus(inputs.orderStatus);
        try{
            const result = await OrderAPI.getOrderList({
                order_status : inputs.orderStatus,
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
            });
            setOrderList(result.orderList);            
            setOrderedProductList(result.orderedProducts);            
        }catch(e){
            console.log('Error...',e);
        }
    }


    const getOrderStatusList = async () => {
        try{
            const result = await StaticAPI.getOrderStatusList({});
            setOrderStatusList(result.orderStatusList);
        }catch(e){
            console.log('Error...',e);
        }
    }

      
    const handleOrderConfirmation = async (data, products) =>{
        setOrderProps({
            order_id: data.id,
            order_date : getDate(inputs.date),
            products: products
        });
        setDialogOpen(true);
    }


    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>View Order List</h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="fromDate">From * </label>
                                                <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="toDate">To * </label>
                                                <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="orderStatus">Status * </label>
                                                <select id="orderStatus" name="orderStatus" value={inputs.orderStatus} class="form-control" onChange={handleInputChange}>
                                                    {(orderStatusList.length > 0 ? orderStatusList : [] ).map((data, index)=>{
                                                        return(
                                                            (data.id !== 4 && data.id !== 5 ) ?  <option id={data.id} value={data.id} >{data.order_status}</option> : null
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> 
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100">
                                            <table className="unit-array-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Order Date</th>
                                                        <th>Order Id</th>
                                                        <th>Customer</th>
                                                        {(orderStatus == 2 || orderStatus  == 1) && <th>Product</th> }
                                                        {(orderStatus == 2 || orderStatus  == 1) && <th>Quantity</th> }
                                                        {orderStatus == 2 && <th>Price</th> }
                                                        <th>Address</th>
                                                        {orderStatus != 1 && <th>Delivery Date</th> }
                                                        {(orderStatus != 1 && orderStatus != 2)  && <th>Actions</th> }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderList.length>0 ? orderList :[]).map((order, index) => {    
                                                        let products = orderedProductList.filter(pro => pro.order_id === order.id);                                                    
                                                        let totalProduct = products.length;                                                     
                                                    return(
                                                        (products.length >0 ? products :[]).map((product) =>  {
                                                            return(
                                                                <tr class="text-center">
                                                                    {totalProduct !== 0 &&                                                                    
                                                                        <Fragment>                                                                            
                                                                            <td rowspan={totalProduct}>{index + 1}</td>
                                                                            <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.order_date)}</td>
                                                                            <td rowspan={totalProduct}>{order.order_id}</td>
                                                                            <td rowspan={totalProduct}>{order.full_name}</td>
                                                                        </Fragment>
                                                                    }
                                                                    {(orderStatus == 2 || orderStatus  == 1) && <td>{product.product_name}</td> }
                                                                    {(orderStatus == 2 || orderStatus  == 1) && <td>{`${product.quantity}  ${product.ordered_unit_name}`}</td> }
                                                                    {orderStatus == 2 &&  <td>{`${product.price}`}</td>}
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            {orderStatus != 1 && <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.delivery_date)}</td> }
                                                                            {(orderStatus != 1 && orderStatus != 2)  && <td rowspan={totalProduct}>
                                                                                    <button class={ "alter-purchase-record"} type="submit" onClick={()=>{handleOrderConfirmation(order, products)}}> Check Product </button>
                                                                            </td>}
                                                                        </Fragment>
                                                                    }   
                                                                    <div style={{display:'none'}}>{totalProduct = 0}</div>
                                                                </tr>
                                                                )
                                                            })
                                                        )
                                                    })
                                                }	
                                                </tbody>
                                            </table>
                                        </div>
									</div>
								</div>
							</div>
						</div>
                    
                </div>
    </section>
		<Footer />
        { dialogOpen ? 
            <OrderAcceptRejectDialog 
                open={dialogOpen} 
                setDialogOpen = {setDialogOpen} 
                props = {orderProps} 
                setOrderList = {setOrderList}
                setOrderedProductList = {setOrderedProductList}
                isUpdatable = {0}
            /> 
            : null 
        }
	</Fragment>
    )
}