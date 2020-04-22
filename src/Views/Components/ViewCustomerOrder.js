import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import StaticAPI from '../../api/static.js';
import OrderAPI from '../../api/order.js';
import {APP_TOKEN} from  '../../api/config/Constants.js'
import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    orderStatus : '1',
}


export default function ViewCustomerOrder() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [orderStatusList, setOrderStatusList]  = useState([]);
    const [orderStatus, setOrderStatus] = useState(1);

    useEffect(()=>{
		getCustomerOrderList();		
		getOrderStatusList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getCustomerOrderList = async () => {
        setOrderStatus(inputs.orderStatus);
        try{
            const result = await OrderAPI.getCustomerOrderList({
                order_status : inputs.orderStatus,
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
                createdBy : APP_TOKEN.get().userId,
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

    const handleOrderVerification = async (data) => {
        try{
            const result = await OrderAPI.orderVerificationByCustomer({
                order_status : inputs.orderStatus,
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
                createdBy : APP_TOKEN.get().userId,
                orderId : data.id,
            });
            setOrderList(result.orderList);
            setOrderedProductList(result.orderedProducts);
        }catch(e){
            console.log('Error...',e);
        }
    }


    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>My Orders</h3>
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
                                                           <option id={data.id} value={data.id} >{data.order_status}</option>
                                                        )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div> 
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getCustomerOrderList}> Click to view</button>
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
                                                        <th>Product</th>
                                                        <th>Quantity</th>
                                                        {orderStatus != 1 && <th>Price</th> }
                                                        <th>Address</th>
                                                        {orderStatus != 1 && <th>Delivery Date</th> }
                                                        {orderStatus == 2 && <th>Action</th> }
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderList.length>0 ? orderList :[]).map((order, index) => {                                                    
                                                    let totalProduct = orderedProductList.filter(pro => pro.order_id === order.id).length;                                                    
                                                    return(
                                                        (orderedProductList.length >0 ? orderedProductList :[]).map((product) =>  {
                                                            if(product.order_id === order.id){
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
                                                                    <td>{product.product_name}</td>
                                                                    <td>{`${product.quantity}  ${product.ordered_unit_name}`}</td>
                                                                    {orderStatus != 1 &&  <td>{`${product.price}`}</td>}
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            {orderStatus != 1 && <td rowspan={totalProduct}>{getDateInDDMMYYYY(order.delivery_date)}</td> }
                                                                            {orderStatus == 2 && <td rowspan={totalProduct}>
                                                                                    <button class="alter-purchase-record" type="submit" onClick={()=>{handleOrderVerification(order)}} >Click to verify</button>
                                                                                </td>
                                                                            }
                                                                        </Fragment>
                                                                    }   
                                                                    <div style={{display:'none'}}>{totalProduct = 0}</div>
                                                                </tr>
                                                                )
                                                            }
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
	</Fragment>
    )
}