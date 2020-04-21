import React, {useState, useEffect, Fragment} from 'react';
import {Link} from  'react-router-dom';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import StaticAPI from '../../api/static.js';


import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
    date : new Date(),
    orderStatus : '1',
}


export default function ViewOrder(props) {
    console.log(props)

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);
    const [orderStatusList, setOrderStatusList]  = useState([]);

    useEffect(()=>{
        getOrderListOfSingleDay();
        getOrderStatusList();
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderListOfSingleDay = async () => {
        try{
            const result = await OrderAPI.getOrderListOfSingleDay({
                order_status : inputs.orderStatus,
                date : getDate(inputs.date),
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


    const proceedToDelivered = async (order) => {
        console.log(order)
        // try{
        //     const result = await OrderAPI.proceedToDelivered({
        //         orderId : orderId,
        //         order_status : inputs.orderStatus,
        //     });
        //     setOrderList(result.orderList);
        //     setOrderedProductList(result.orderedProducts);            
        // }catch(e){
        //     console.log('Error...',e);
        // }
    }

    return(
		<Fragment>
			<Header />
			<section className="ftco-section">
                <div class="container">
                <h3>Modify Orders</h3>
                <div class="row justify-content-center p-bottom-30">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="p-5 bg-light b-top-dark">
                                    <div class="row align-items-end">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="date">Date * </label>
                                                <input id="date" name="date" type="date" value={getDate(inputs.date)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-6">
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
                                                <button class="btn btn-primary px-4" onClick={getOrderListOfSingleDay}> Click to view</button>
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
                                                        {/* <th>Price</th> */}
                                                        <th>Quantity</th>
                                                        {/* <th>Total</th> */}
                                                        <th>Address</th>
                                                        {/* <th>Total</th> */}
                                                        {inputs.orderStatus == 1 && <th>Action</th>}
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
                                                                    {/* <td>{`$${product.price}/${product.unit_name}`}</td> */}
                                                                    <td>{`${product.quantity}  ${product.ordered_unit_name}`}</td>
                                                                    {/* <td>{product.total}</td> */}
                                                                    {totalProduct !== 0 &&
                                                                        <Fragment>
                                                                            <td rowspan={totalProduct}>{`${order.flat_add}, ${order.street_add}, ${order.city}`}</td>
                                                                            {/* <td rowspan={totalProduct}>{order.total}</td> */}
                                                                            {inputs.orderStatus == 1 && <td rowspan={totalProduct}>
                                                                                <Link to={{pathname :'/delivery-form', state : order}}>Click to delivered</Link>
                                                                            </td>}
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
					{/* <div className="row mt-5">
						<div className="col text-center">
							<div className="block-27">
							<ul>
								<li><a href="#">&lt;</a></li>
								<li className="active"><span>1</span></li>
								<li><a href="#">2</a></li>
								<li><a href="#">3</a></li>
								<li><a href="#">4</a></li>
								<li><a href="#">5</a></li>
								<li><a href="#">&gt;</a></li>
							</ul>
							</div>
						</div>
					</div> */}
    </section>
		<Footer />
	</Fragment>
    )
}