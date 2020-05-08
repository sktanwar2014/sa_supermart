import React, {useState, useEffect, Fragment} from 'react';

//Components 
import OrderAPI from '../../api/order.js';
import {CART_TOKEN, APP_TOKEN} from '../../api/config/Constants.js';
import Footer from '../Partials/Footer.js';
import Header from '../Partials/Header.js';
import CallLoader from '../../common/Loader.js';
import {getDateInDDMMYYYY, getDate} from '../../common/moment.js';

const RESET_VALUES = {
	firstName: '',
	lastName: '',
	state: '',
	streetAddress: '',
	flatAdd: '',
	city: '',
	postCode: '',
	phone: '',
	email: '',
	order_date : '',
}


export default function ProceedToCheckout(props) {
	
	const [preAddresses,  setPreAddresses] = useState([]);
	const [inputs, setInputs] = useState(RESET_VALUES);
    const [isLoading, setIsLoading] = useState(false);
	let tomorrowDate =  new Date();
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
		
	useEffect(()=>{
		fetchPreviousBillingAddresss();
	},[]);
	
	const  handleInputChange = (e) => {
		setInputs({...inputs, [e.target.name]: e.target.value});
	}

	
	const handlePreAddressSelect = (address) => {
		let firstName  = address.full_name ? address.full_name.split(' ')[0] : '';
		let lastName = address.full_name ? address.full_name.split(' ')[1] : '';
		setInputs({
			shipping_id: address.id,
			firstName: firstName,
			lastName: lastName,
			state: address.state,
			streetAddress: address.street_add,
			flatAdd: address.flat_add,
			city: address.city,  
			postCode: address.pincode,
			phone: address.mobile,
			email: address.email
		})
	}

	const handleRemoveAddress = async(id) => {
		try{
			setIsLoading(true);

			const result = await OrderAPI.removeSelectedAddress({id: id, userId: APP_TOKEN.get().userId});
			setPreAddresses(result.billingAddresses);
			setInputs(RESET_VALUES);
			setIsLoading(false);

		}catch(e){
			console.log(e);
		}
	}


	const fetchPreviousBillingAddresss = async() => {
		try{
			setIsLoading(true);

			const result = await OrderAPI.fetchPreviousBillingAddresss({userId: APP_TOKEN.get().userId});
			setPreAddresses(result.billingAddresses)
			setIsLoading(false);

		}catch(e){
			console.log(e);
		}
	}

    const handleSubmit = async (e) => {        
		e.preventDefault();
		setIsLoading(true);
        try{
            const formData = {
				shipping_id : inputs.shipping_id,
                firstName : inputs.firstName,
                lastName : inputs.lastName,
                state : inputs.state,
                streetAddress : inputs.streetAddress,
                flatAdd : inputs.flatAdd,
                city : inputs.city,
                postCode : inputs.postCode,
                phone : inputs.phone,
				email : inputs.email,
				order_date : inputs.order_date,
				createdBy :  APP_TOKEN.get().userId,
				
				cartItems : CART_TOKEN.get().cart,
			};
			
			const result = await OrderAPI.addNewOrder(formData);
			setIsLoading(false);
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
				<div class="hero-wrap hero-bread" style={{backgroundImage: `url('images/category-2.jpg')`}}>
					<div class="container">
						<div class="row no-gutters slider-text align-items-center justify-content-center">
						<div class="col-md-9 ftco-animate text-center fadeInUp ftco-animated">
							{/* <p class="breadcrumbs"><span class="mr-2"><a href="index.html"></a></span> <span>Product</span></p> */}
							<h1 class="mb-0 bread">Proceed to Checkout</h1>
						</div>
						</div>
					</div>
				</div>
        	<section class="ftco-section">
      			<div class="container">
					<div id="addressList" class="row">
						<h3>Your Addresses</h3>
					</div>
					<div class="row">
						{(preAddresses.length>0 ? preAddresses : []).map((data, index) => {
							return(
								<div class="col-12 col-md-4">
									<div class="single-special pre-address wow fadeInUp">
											<h4>{data.full_name}</h4>
											<ul>
												<li>{data.flat_add}</li>
												<li>{data.street_add}</li>
												<li>{data.city + ' - ' + data.pincode}</li>
												<li>{data.state}</li>
												<li>{data.mobile}</li>
											</ul>
											<a href="#billing-detail-form" onClick={()=>{handlePreAddressSelect(data)}}>Choose as billing address</a>
											<a href="#addressList" onClick={()=>{handleRemoveAddress(data.id)}}>Remove</a>
									</div>
								</div>
							)
						})}
					</div>
					<hr />
					<div className="row">
					<form onSubmit={handleSubmit} class="billing-form">
						<div class="row justify-content-center">
							<div class="col-xl-7 ftco-animate fadeInUp ftco-animated">
									{/* <h3 id="billing-detail-form" class="mb-4 billing-heading">Billing Details</h3> */}
										<div class="row align-items-end">
											<div class="col-md-6">
												<div class="form-group">
													<label for="firstname">First Name</label>
													<input type="text" id="firstName" name="firstName" value={inputs.firstName} onChange={handleInputChange} class="form-control" placeholder="" required />
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="lastname">Last Name</label>
													<input type="text" id="lastName" name="lastName" value={inputs.lastName}  onChange={handleInputChange}  class="form-control" placeholder="" required />
												</div>
											</div>
											<div class="col-md-12">
												<div class="form-group">
													<label for="country">State / Country</label>
													<input type="text" id="state" name="state" value={inputs.state}  onChange={handleInputChange} class="form-control" placeholder="" required />
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="streetaddress">Street Address</label>
													<input type="text" id="streetAddress" name="streetAddress" value={inputs.streetAddress}  onChange={handleInputChange} class="form-control" placeholder="House number and street name" required/>
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
												<input type="text" id="flatAdd" name="flatAdd" class="form-control" value={inputs.flatAdd}  onChange={handleInputChange} placeholder="Appartment, suite, unit etc." required />
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="towncity">Town / City</label>
													<input type="text" id="city" name="city" class="form-control"  onChange={handleInputChange} value={inputs.city} placeholder="" required/>
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="postcodezip">Postcode / ZIP *</label>
													<input type="number" id="postCode" name="postCode" class="form-control" onChange={handleInputChange} value={inputs.postCode} placeholder="" required />
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="phone">Phone</label>
													<input type="number" id="phone"  name="phone"  value={inputs.phone} onChange={handleInputChange} class="form-control" placeholder="" required />
												</div>
											</div>
											<div class="col-md-6">
												<div class="form-group">
													<label for="emailaddress">Email Address</label>
													<input type="email" id="email" name="email" value={inputs.email} onChange={handleInputChange} class="form-control" placeholder="" required />
												</div>
											</div>
										</div>	          					
									</div>
								<div class="col-xl-5">
									<div class="row mt-5 pt-3">
										<div class="col-md-12" style={{marginTop:'230px'}}>
											<div class="cart-detail p-3 p-md-4">
												<div class="form-group">
													<label for="date">Order for (Date) * </label>
													<input id="order_date" name="order_date" type="date"class="form-control"  min={getDate(tomorrowDate)} value={getDate(inputs.order_date)} onChange={handleInputChange} required />
												</div>
												<p><input type="submit" value="Place an order" class="btn btn-primary py-3 px-4" /></p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
	    	</section>
		<Footer />
		{isLoading ?   <CallLoader />   : null  }

	</Fragment>
    )
}