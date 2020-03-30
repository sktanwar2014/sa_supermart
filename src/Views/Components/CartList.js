import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import CartAPI from '../../api/cart.js';
import {CART_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';

export default function BrowseProduct() {
	
    const [cartList, setCartList] = useState([]);
	const [totalInCart, setTotalInCart] = useState(CART_TOKEN.get().cartTotal);
	const [cartTotal, setCartTotal]= useState();

	const removeProductInCart =async (productId) => {		
		CART_TOKEN.removeProduct({productId : productId});				
		setTotalInCart(CART_TOKEN.get().cartTotal)
	}

	useEffect(()=>{		
		setCartList(CART_TOKEN.get().cart);
		let cartTotal = 0;
		CART_TOKEN.get().cart.map(data => {
			cartTotal = cartTotal + Number(data.total);
		})
		setCartTotal(cartTotal);
    },[totalInCart]);

    return(
		<Fragment>
		<Header totalInCart = {totalInCart} />
        <section className="cat_product_area section_gap">
			<div className="container">						
				<div className="row">
					<div className="col-md-12 ftco-animate fadeInUp ftco-animated">
					<h3 class="mb-4 billing-heading">Cart List</h3>
						<div className="cart-list">
							<table className="table">
								<thead className="thead-primary">
								<tr className="text-center">
									<th>Product List</th>
									<th>Price</th>
									<th>Quantity</th>
									<th>Total</th>
									<th>&nbsp;</th>
								</tr>
								</thead>
								<tbody>
									{(cartList.length > 0 ? cartList : []).map((data, index) => {
										return(
											<tr className="text-center">
												<td className="product-name"> <h3>{data.product_name }</h3></td>
												<td className="price">{`$${data.price}/${data.unit_name}`}</td>
												<td className="price">{`${data.quantity} ${data.ordered_unit_name}`}</td>
												<td className="price">{`${data.total}`}</td>
												<td className="product-remove">
													<a className="buy-now d-flex justify-content-center align-items-center mx-1"
														onClick={()=>{removeProductInCart(data.id)}} 
													>
														<span><i className="ion-ios-close"></i></span>
													</a>    
												</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>						
					</div>					
				</div>
			</div>	
			<div class="row justify-content-end">
    			<div class="col-lg-4 mt-5 cart-wrap ftco-animate fadeInUp ftco-animated">
    				{/* <div class="cart-total mb-3">
    					<h3>Coupon Code</h3>
    					<p>Enter your coupon code if you have one</p>
  						<form action="#" class="info">
	              <div class="form-group">
	              	<label for="">Coupon code</label>
	                <input type="text" class="form-control text-left px-3" placeholder="" />
	              </div>
	            </form>
    				</div>
    				<p><a href="checkout.html" class="btn btn-primary py-3 px-4">Apply Coupon</a></p> */}
    			</div>
    			<div class="col-lg-4 mt-5 cart-wrap ftco-animate fadeInUp ftco-animated">
    				{/* <div class="cart-total mb-3">
    					<h3>Estimate shipping and tax</h3>
    					<p>Enter your destination to get a shipping estimate</p>
  						<form action="#" class="info">
	              <div class="form-group">
	              	<label for="">Country</label>
	                <input type="text" class="form-control text-left px-3" placeholder="" />
	              </div>
	              <div class="form-group">
	              	<label for="country">State/Province</label>
	                <input type="text" class="form-control text-left px-3" placeholder="" />
	              </div>
	              <div class="form-group">
	              	<label for="country">Zip/Postal Code</label>
	                <input type="text" class="form-control text-left px-3" placeholder="" />
	              </div>
	            </form>
    				</div>
    				<p><a href="checkout.html" class="btn btn-primary py-3 px-4">Estimate</a></p> */}
    			</div>
    			<div class="col-lg-4 mt-5 cart-wrap ftco-animate fadeInUp ftco-animated">
    				<div class="cart-total mb-3">
    					<h3>Cart Totals</h3>
    					{/* <p class="d-flex">
    						<span>Subtotal</span>
    						<span>$20.60</span>
    					</p>
    					<p class="d-flex">
    						<span>Delivery</span>
    						<span>$0.00</span>
    					</p>
    					<p class="d-flex">
    						<span>Discount</span>
    						<span>$3.00</span>
    					</p> */}
    					<hr />
    					<p class="d-flex total-price">
    						<span>Total</span>
    						<span>{`$${cartTotal}`}</span>
    					</p>
    				</div>
    				<p><a href="/proceed-to-checkout" class="btn btn-primary py-3 px-4">Proceed to Checkout</a></p>
    			</div>
    		</div>
		</div>
	</section>
	<Footer />
	</Fragment>
    )
}