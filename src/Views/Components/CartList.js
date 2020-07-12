import React, {useState, useEffect, Fragment} from 'react';
import {Link} from  'react-router-dom';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import {CART_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';
import { API_URL } from "../../api/config/Constants";



export default function CartList() {
	
    const [cartList, setCartList] = useState([]);
	const [productUnitList, setProductUnitList] = useState([]);
 
	useEffect(()=>{
		setCartList(CART_TOKEN.get().cart);
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
	
	const removeProductInCart =async (productId) => {
		setCartList([]);
		CART_TOKEN.removeProduct({productId : productId});
		setCartList(CART_TOKEN.get().cart);
	}
	
	
	const getProductPacketInfo = async(unitId,  productId) => {
		try{
			const result = await CategoriesAPI.getProductPacketInfo({unitId: unitId,  productId: productId});
			return result.productPacketInfo;
		}catch(e){
			console.log('error...', e);
		}
	}

	
	const handleUnitChange = async (e) => {
		let unitId = document.getElementById(e.target.name).value;
		let productId = String(e.target.name).split('-')[1];
		let isPacket = productUnitList.find(ele => {return ele.id == unitId && ele.is_bundle == 1});

		if(isPacket){
			const result = await getProductPacketInfo(unitId,  productId);
				let pTag = document.createElement("p")
				pTag.className= "packet-unit-text";

				if(result.length>0){
					let values = result[0];
					pTag.textContent  = values.packet_weight + " " + values.packet_unit_name + ' in ' + values.unit_value + " " +values.unit_name;
				}else{
					pTag.textContent  = 'Weight not defined';
				}
				

				if(document.getElementById('productUnitTd-'+productId).childElementCount ==  2){
					document.getElementById('productUnitTd-'+productId).removeChild(document.getElementById('productUnitTd-'+productId).lastChild)
					document.getElementById('productUnitTd-'+productId).appendChild(pTag);
					document.getElementById('productUnitDiv-'+productId).classList.add('packet-unit');
				}else{
					document.getElementById('productUnitTd-'+productId).appendChild(pTag);
					document.getElementById('productUnitDiv-'+productId).classList.add('packet-unit');
				}				
		}else{
			if(document.getElementById('productUnitTd-'+productId).childElementCount ==  2){
				document.getElementById('productUnitTd-'+productId).removeChild(document.getElementById('productUnitTd-'+productId).lastChild)
				document.getElementById('productUnitDiv-'+productId).classList.remove('packet-unit');
			}
		}
	}


	
	const updateProductCart = (e) => {
		e.preventDefault();
		(cartList.length > 0 ? cartList : []).map(product => {
			const quantity = document.getElementById(`productQuantity-${product.id}`).value;
			const selected_unit_id  = document.getElementById(`productUnit-${product.id}`).value;

			product.quantity = quantity;
			product.selected_unit_id = selected_unit_id;

			CART_TOKEN.set({product : product});
		});
		window.location.pathname = '/proceed-to-checkout';
	}

	const handleQuantityChange = (e) => {
		let name = String(e.target.name);
		const prodId = Number(name.split('-')[1]);
		const value = e.target.value;
		let tempCart = [...cartList];

		(tempCart.length > 0 ? tempCart : []).map((data, index) => {
			if(data.id === prodId){
				data.quantity = value;
				CART_TOKEN.set({product : data});
			}
		})
		setCartList(tempCart);
	}

    return(
		<Fragment>
			<Header />
				<div class="hero-wrap hero-bread" style={{backgroundImage: `url('images/bg_1.jpg')`}}>
					<div class="container">
						<div class="row no-gutters slider-text align-items-center justify-content-center">
						<div class="col-md-9 ftco-animate text-center fadeInUp ftco-animated">
							<p class="breadcrumbs"><span class="mr-2"><a href="index.html">Home</a></span> <span>Cart</span></p>
							<h1 class="mb-0 bread">My Cart</h1>
						</div>
						</div>
					</div>
				</div>

				<section className="cat_product_area section_gap">
						<form onSubmit={updateProductCart}>
							<div className="container">						
								<div className="row">
									<div className="col-md-12 ftco-animate fadeInUp ftco-animated">
									{/* <h3 class="mb-4 billing-heading">Cart List</h3> */}
										<div className="cart-list">
										<table class="table">
											<thead class="thead-primary">
											<tr class="text-center">
												<th>&nbsp;</th>
												<th>Product name</th>						        
												<th>Quantity</th>
												<th>Unit</th>
												<th>&nbsp;</th>
											</tr>
											</thead>
											<tbody>
											{(cartList.length > 0 ? cartList : []).map((data, index) => {
												return(
													<tr class="text-center">						        
														<td class="image-prod">
															<div class="img">
																<Link to={{pathname: '/product-details', state:{productDetails: data}}}>
																	<img className="cart-product-img-fluid" src={API_URL + "/api/images?path=productImages/" + data.image_name}  alt={data.image_name} />
																</Link>
															</div>
														</td>
														<td class="product-name">
															<h3>{data.product_name}</h3>
															{/* <p>...See Info</p> */}
														</td>
														
														<td class="quantity">
															<div class="input-group">
																<input type="number" id={"productQuantity-"+data.id} name={"productQuantity-"+data.id} class="quantity form-control input-number"  value={data.quantity ? data.quantity : ''} min="0" step="0.1" required onChange={handleQuantityChange} />
															</div>								  
														</td>
														<td class="quantity" id={'productUnitTd-'+data.id}>
															<div id={'productUnitDiv-'+data.id} className="input-group">
																<select className="form-control"  name={'productUnit-'+data.id} id={'productUnit-'+data.id} onChange={handleUnitChange} required>
																	<option  value="" >Select unit</option>
																	{(productUnitList.length > 0 ? productUnitList : [] ).map((unit)=>{
																			return(
																				Object.values((data.unit_id).split(',')).map(unit_id => {
																					return(
																						unit_id == unit.id  ? <option id={unit.id}  value={unit.id} selected={data.selected_unit_id == unit.id }>{unit.unit_name}</option>  : null
																					)
																				})
																			)
																		})
																	}
																</select>
															</div>
														</td>
														<td class="product-remove"><a onClick={()=>{removeProductInCart(data.id)}} ><span class="ion-ios-close"></span></a></td>
													</tr>
												)
											})}
											</tbody>
										</table>
									</div>					
								</div>
							</div>	
							<div class="row justify-content-end">
								<div class="col-lg-4 mt-5 cart-wrap ftco-animate fadeInUp ftco-animated">
									{(cartList.length > 0) ? 
										<p><button type="submit" class="btn btn-primary py-3 px-4 w-100" >Proceed to Chedckout</button></p>
									:  <p class="empty-cart">Cart is empty. <a  href="/">Back to home</a></p>
									}
								</div>
							</div>		
						</div>
					</form>
				</section>
		<Footer />
	</Fragment>
    )
}