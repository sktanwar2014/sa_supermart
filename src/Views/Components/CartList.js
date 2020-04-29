import React, {useState, useEffect, Fragment} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';
import StaticAPI from '../../api/static.js';
import CartAPI from '../../api/cart.js';
import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';

export default function CartList() {
	const userId = APP_TOKEN.get().userId;
    const roleId = APP_TOKEN.get().role_id;
	
	
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
			<div className="py-1 bg-primary">
            <div className="container">
                <div className="row no-gutters d-flex align-items-start align-items-center px-md-0">
                    <div className="col-lg-12 d-block">
                        <div className="row d-flex" style={{padding:'10px'}}>
                            {/* <div className="col-md pr-4 d-flex topper align-items-center">
                                <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-phone2"></span></div>
                                <span className="text">+ 1235 2355 98</span>
                            </div>
                            <div className="col-md pr-4 d-flex topper align-items-center">
                                <div className="icon mr-2 d-flex justify-content-center align-items-center"><span className="icon-paper-plane"></span></div>
                                <span className="text">youremail@email.com</span>
                            </div>
                            <div className="col-md-5 pr-4 d-flex topper align-items-center text-lg-right">
                                <span className="text">3-5 Business days delivery &amp; Free Returns</span>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
            <div className="container">
            <a className="navbar-brand" href="/">SA SUPERMART</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="oi oi-menu"></span> Menu
            </button>

            <div className="collapse navbar-collapse" id="ftco-nav">
                {/* <li className="nav-item active"><a href="/" className="nav-link">Home</a></li> */}
                {(userId == 1 && roleId == 1) ?
                    <ul className="navbar-nav ml-auto">   
						<li className="nav-item"><a href="/" className="nav-link">Home</a></li> 
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Products</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/add-new-product">Add New</a>
                                <a className="dropdown-item" href="/view-added-product">View List</a>                    
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Orders</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/view-order-list">View</a>
                            </div>
                        </li>
                        <li className="nav-item"><a href="/logout" className="nav-link">Logout</a></li> 
                    </ul>
                    :
                    <ul className="navbar-nav ml-auto">   
                        <li className="nav-item"><a href="/" className="nav-link">Home</a></li> 
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Orders</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/view-user-order-list">View</a>
                            </div>
                        </li>
                        <li className="nav-item cta cta-colored"><a href="/cart-list" className="nav-link"><span className="icon-shopping_cart"></span>[{totalInCart}]</a></li>
                        <li className="nav-item"><a href="/logout" className="nav-link">Logout</a></li> 
                    </ul>
                }
                
                {/* <li className="nav-item"><a href="#" className="nav-link">About</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Blog</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Contact</a></li> */}
            </div>
            </div>
        </nav>



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
									{/* <th>Price</th> */}
									<th>Quantity</th>
									{/* <th>Total</th> */}
									<th>&nbsp;</th>
								</tr>
								</thead>
								<tbody>
									{(cartList.length > 0 ? cartList : []).map((data, index) => {
										return(
											<tr className="text-center">
												<td className="product-name"> <h3>{data.product_name }</h3></td>
												{/* <td className="price">{`$${data.price}/${data.unit_name}`}</td> */}
												<td className="price">{`${data.quantity} ${data.ordered_unit_name}`}</td>
												{/* <td className="price">{`${data.total}`}</td> */}
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
    				{/* <div class="cart-total mb-3">
    					<h3>Cart Totals</h3>
    					<p class="d-flex">
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
    					</p>
    					<hr />
    					<p class="d-flex total-price">
    						<span>Total</span>
    						<span>{`$${cartTotal}`}</span>
    					</p>
    				</div> */}
    				<p><a href="/proceed-to-checkout" class="btn btn-primary py-3 px-4 w-100" >Proceed to Checkout</a></p>
    			</div>
    		</div>
		</div>
	</section>
	<Footer />
	</Fragment>
    )
}