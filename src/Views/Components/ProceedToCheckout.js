import React, {useState, useEffect, Fragment} from 'react';

//Components 
import OrderAPI from '../../api/order.js';
import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';

export default function ProceedToCheckout(props) {
	
    
	const [cartTotal, setCartTotal]= useState();


	useEffect(()=>{
		let cartTotal = 0;
		CART_TOKEN.get().cart.map(data => {
			cartTotal = cartTotal + Number(data.total);
		})
		setCartTotal(cartTotal);
    },[]);

	
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const formData = {
                firstName : document.getElementById('firstName').value,
                lastName : document.getElementById('lastName').value,
                state : document.getElementById('state').value,
                streetAddress : document.getElementById('streetAddress').value,
                flatAdd : document.getElementById('flatAdd').value,
                city : document.getElementById('city').value,
                postCode : document.getElementById('postCode').value,
                phone : document.getElementById('phone').value,                
                email : document.getElementById('email').value,
				createdBy :  APP_TOKEN.get().userId,
				
				itemsTotal: cartTotal,
				cartItems : CART_TOKEN.get().cart,

			};
			
			const result = await OrderAPI.addNewOrder(formData);
			if(result=== true){
				CART_TOKEN.removeCart();
			}
                props.history.push('/');
        }catch(e){
            console.log('Error...', e);
        }
    }


    return(
		<Fragment>
		<Header />
        	<section class="ftco-section">
      			<div class="container">
				  <form onSubmit={handleSubmit} class="billing-form">
        			<div class="row justify-content-center">
          				<div class="col-xl-7 ftco-animate fadeInUp ftco-animated">
							
								<h3 class="mb-4 billing-heading">Billing Details</h3>
	          						<div class="row align-items-end">
	          							<div class="col-md-6">
	                						<div class="form-group">
	                							<label for="firstname">First Name</label>
	                  							<input type="text" id="firstName" class="form-control" placeholder="" required />
	                						</div>
	              						</div>
	              						<div class="col-md-6">
	                						<div class="form-group">
	                							<label for="lastname">Last Name</label>
												<input type="text" id="lastName"  class="form-control" placeholder="" required />
											</div>
										</div>
					                	<div class="w-100"></div>
										<div class="col-md-12">
											<div class="form-group">
												<label for="country">State / Country</label>
												<input type="text" id="state" class="form-control" placeholder="" required />
														{/* <div class="select-wrap">
													<div class="icon"><span class="ion-ios-arrow-down"></span></div>
													<select name="" id="" class="form-control">
														<option value="">France</option>
														<option value="">Italy</option>
														<option value="">Philippines</option>
														<option value="">South Korea</option>
														<option value="">Hongkong</option>
														<option value="">Japan</option>
													</select>
													</div> */}
											</div>
										</div>
		            					<div class="w-100"></div>
										<div class="col-md-6">
											<div class="form-group">
												<label for="streetaddress">Street Address</label>
												<input type="text" id="streetAddress" class="form-control" placeholder="House number and street name" required/>
											</div>
										</div>
										<div class="col-md-6">
											<div class="form-group">
											<input type="text" id="flatAdd" class="form-control" placeholder="Appartment, suite, unit etc." required />
											</div>
										</div>
										<div class="w-100"></div>
										<div class="col-md-6">
											<div class="form-group">
												<label for="towncity">Town / City</label>
												<input type="text" id="city" class="form-control" placeholder="" required/>
											</div>
		            					</div>
										<div class="col-md-6">
											<div class="form-group">
												<label for="postcodezip">Postcode / ZIP *</label>
												<input type="number" id="postCode" class="form-control" placeholder="" required />
											</div>
		            					</div>
		            					<div class="w-100"></div>
		            					<div class="col-md-6">
											<div class="form-group">
												<label for="phone">Phone</label>
												<input type="number" id="phone"  class="form-control" placeholder="" required />
											</div>
	              						</div>
										<div class="col-md-6">
											<div class="form-group">
												<label for="emailaddress">Email Address</label>
												<input type="email" id="email" class="form-control" placeholder="" required />
											</div>
										</div>
                						<div class="w-100"></div>
										{/* <div class="col-md-12">
											<div class="form-group mt-4">
												<div class="radio">
										  			<label class="mr-3">
														<input type="radio" name="optradio" /> Create an Account? 
													</label>
										  			<label>
														<input type="radio" name="optradio" /> Ship to different address
													</label>
												</div>
											</div>
						                </div> */}
	            					</div>	          					
							</div>
							<div class="col-xl-5">
	          					<div class="row mt-5 pt-3">
	          						<div class="col-md-12 d-flex mb-5">
	          							<div class="cart-detail cart-total p-3 p-md-4">
	          								<h3 class="billing-heading mb-4">Cart Total</h3>
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
													<span>{cartTotal}</span>
												</p>
										</div>
									</div>
								<div class="col-md-12">
									<div class="cart-detail p-3 p-md-4">
										{/* <h3 class="billing-heading mb-4">Payment Method</h3>
													<div class="form-group">
														<div class="col-md-12">
															<div class="radio">
															<label><input type="radio" name="optradio" class="mr-2" /> Direct Bank Tranfer</label>
															</div>
														</div>
													</div>
													<div class="form-group">
														<div class="col-md-12">
															<div class="radio">
															<label><input type="radio" name="optradio" class="mr-2" /> Check Payment</label>
															</div>
														</div>
													</div>
													<div class="form-group">
														<div class="col-md-12">
															<div class="radio">
															<label><input type="radio" name="optradio" class="mr-2" /> Paypal</label>
															</div>
														</div>
													</div>
													<div class="form-group">
														<div class="col-md-12">
															<div class="checkbox">
															<label><input type="checkbox" value="" class="mr-2" /> I have read and accept the terms and conditions</label>
															</div>
												</div>
											</div> */}
										<p><input type="submit" value="Place an order" class="btn btn-primary py-3 px-4" /></p>
									</div>
	          					</div>
	          				</div>
        				</div>
					</div>
					</form>
				</div>
	    	</section>
		<Footer />
	</Fragment>
    )
}