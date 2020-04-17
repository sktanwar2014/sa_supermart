import React, {useState, useEffect, Fragment} from 'react';

//Components 
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import OrderAPI from '../../api/order.js';
import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
    toDate : new Date(),
    fromDate : new Date(),
}


export default function ViewOrderedProduct() {

    const [inputs, setInputs] =  useState(RESET_VALUES);
    const [orderedProductList, setOrderedProductList] = useState([]);
    

    useEffect(()=>{
		getOrderedProductList();		
    },[]);


    
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

    const getOrderedProductList = async () => {
        try{
            const result = await OrderAPI.getOrderedProductList({
                from_date : getDate(inputs.fromDate),
                to_date : getDate(inputs.toDate),
            });
            // console.log(result)
            setOrderedProductList(result.orderedProductList);            
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
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="fromDate">From * </label>
                                                <input id="fromDate" name="fromDate" type="date" value={getDate(inputs.fromDate)} class="form-control"  onChange={handleInputChange} />
                                            </div>
                                        </div>   
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label for="toDate">To * </label>
                                                <input id="toDate" name="toDate" type="date" value={getDate(inputs.toDate)} class="form-control" onChange={handleInputChange} />
                                            </div>
                                        </div>  
                                        {/* <div class="col-md-4">
                                            <div class="form-group">
                                                <label for="orderStatus">Status * </label>
                                                <select id="orderStatus" name="orderStatus" value={inputs.orderStatus} class="form-control" onChange={handleInputChange}>
                                                    <option  value = "1">New Orders</option>
                                                    <option  value = "2">Delivered</option>
                                                </select>
                                            </div>
                                        </div>  */}
                                        <div class="col-md-12 m-bottom-20">
                                            <div class="form-group">
                                                <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={getOrderedProductList}> Click to view</button>
                                                </div>
                                            </div>
                                        </div> 
                                        <div class="w-100">
                                            <table className="unit-array-table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Products</th>
                                                        <th>Total Quantity</th>
                                                        {/* <th>Action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(orderedProductList.length>0 ? orderedProductList :[]).map((data, index) => {                                                    
                                                    return(
                                                        <tr>
                                                            <td>{index + 1}</td>
                                                            <td>{data.product_name}</td>
                                                            <td>{data.weight+ ' ' + data.unit_name}</td>
                                                        </tr>
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