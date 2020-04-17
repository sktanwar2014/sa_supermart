import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
    orderStatus : '1',
}


export default function ViewOrder() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
	const [orderList, setOrderList] = useState([]);
    const [orderedProductList, setOrderedProductList] = useState([]);

    useEffect(()=>{
		getOrderList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderList = async () => {
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


    const proceedToDelivered = async (orderId) => {
        try{
            const result = await OrderAPI.proceedToDelivered({
                orderId : orderId,
                order_status : inputs.orderStatus,
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
                                                    <option  value = "1">New Orders</option>
                                                    <option  value = "2">Delivered</option>
                                                    {/* {(subCategory !== undefined && subCategory !== null && subCategory !== "") && 
                                                        (subCategory.length > 0 ? subCategory : [] ).map((data, index)=>{
                                                        return(
                                                            <option id={data.id} value={data.id} >{data.category_name}</option>
                                                        )
                                                        })
                                                    } */}
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

                                                    {/* {(productUnitBio.length > 0 ? productUnitBio : []).map((data, index) => {
                                                        return(
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    {data.unitValue + ' ' + data.unitInName}
                                                                    {(data.packetWeight && data.packetUnitId) ? `(${data.packetWeight} ${data.packetUnitIdName} per  ${data.unitInName})` : ``}
                                                                </td>
                                                                <td>{data.price}</td>
                                                                <td>
                                                                    <button type="button" className="delete-button" onClick={()=>{handleDeleteProductUnit(index)}}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })} */}
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
                                                                            {inputs.orderStatus == 1 && <td rowspan={totalProduct}><a href="" onClick={()=>{proceedToDelivered(order.id)}}>Click to delivered</a></td>}
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