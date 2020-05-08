import React, {useState, useEffect, Fragment} from 'react';

//Components
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import {API_URL, APP_TOKEN, CART_TOKEN} from '../../api/config/Constants.js';

import StaticAPI from '../../api/static.js';
import CategoriesAPI from '../../api/categories.js';

export default function CustomerViewProductDetails(props) {

    const userId = APP_TOKEN.get().userId;
    const [product, setProduct] = useState({});
    const [productUnitList, setProductUnitList] = useState([]);
    const [cartList, setCartList] = useState([]);


    useEffect(() => {        
        let product = props.location.state;
        if( product !== null && product !== undefined && product !== ""){
            setProduct(product.productDetails);
        }       
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
    

    
	const getProductPacketInfo = async(unitId,  productId) => {
		try{
			const result = await CategoriesAPI.getProductPacketInfo({unitId: unitId,  productId: productId});
			return result.productPacketInfo;
		}catch(e){
			console.log('error...', e);
		}
	}

	
	const handleUnitChange = async (e) => {
		let unitId = e.target.value;
		let productId = product.id;
		let isPacket = productUnitList.find(ele => {return ele.id == unitId && ele.is_bundle == 1});

		if(isPacket){
			const result = await getProductPacketInfo(unitId,  productId);
                let pTag = document.getElementById("unitPackageInfo");
                pTag.className= "packet-unit-text";
                if(result.length>0){
					let values = result[0];
					pTag.textContent  = values.packet_weight + " " + values.packet_unit_name + ' in ' + values.unit_value + " " +values.unit_name;
				}else{
					pTag.textContent  = 'Weight not defined';
				}
				
		}else{
			document.getElementById("unitPackageInfo").textContent = '';
		}
    }
    

    const updateProductCart = (e) => {
        e.preventDefault();
        
        let prod = product;

        prod.user_id = userId;
        prod.quantity = document.getElementById(`productQuantity`).value;
        prod.selected_unit_id = document.getElementById(`productUnit`).value;;

        CART_TOKEN.set({product : prod});
        setCartList(CART_TOKEN.get().cart);

        window.location.pathname = '/cart-list';
	}

    
	// const addProductInCart =async (prod) => {
	// 	const product = prod;
	// 	product.user_id = userId;
	// 	CART_TOKEN.set({product : product});
	// 	setCartList(CART_TOKEN.get().cart);
	// }


return(
    <Fragment>
        <Header />
        <div class="hero-wrap hero-bread" style={{backgroundImage: `url('images/bg_1.jpg')`}}>
            <div class="container">
                <div class="row no-gutters slider-text align-items-center justify-content-center">
                    <div class="col-md-9 ftco-animate text-center fadeInUp ftco-animated">
                        <p class="breadcrumbs"><span class="mr-2"><a href="index.html">Home</a></span> <span class="mr-2"><a href="index.html">Product</a></span> <span>Single Product</span></p>
                        <h1 class="mb-0 bread">Product Details</h1>
                    </div>
                </div>
            </div>
        </div>
        {cartList && <section class="ftco-section">
            <div class="container">
            <form onSubmit={updateProductCart}>
                <div class="row">
                    <div class="col-lg-6 mb-5 ftco-animate fadeInUp ftco-animated">
                        {/* <a  href={API_URL + "/api/images?path=productImages/" + product.image_name} class="image-popup"> */}
                            <img src={API_URL + "/api/images?path=productImages/" + product.image_name} class="img-fluid" alt="product image" />
                        {/* </a> */}
                    </div>
                    <div class="col-lg-6 product-details pl-md-5 ftco-animate fadeInUp ftco-animated">
                        <h3>{product.product_name}</h3>
                        <p> {product.description} </p>
                            <div class="row mt-4">                                
                                <div class="ol-md-6">
                                    <label for="productQuantityproductQuantity">Quantity</label>
                                    <input type="number" class="quantity form-control input-number" defaultValue={ product.quantity } id="productQuantity" min="0" step="0.1" required />
                                </div>
                                <div class="col-md-6">
                                    <label for="productUnit">Unit</label>
                                    <div class="form-group d-flex">
                                        <div class="select-wrap">
                                            <div class="icon"><span class="ion-ios-arrow-down"></span></div>
                                            <select id="productUnit" class="form-control" onChange={handleUnitChange} required>
                                               {(productUnitList.length > 0 ? productUnitList : []).map((unit)=>{
                                                    return(
                                                        Object.values(product.unit_id).map(unit_id => {
                                                            return(
                                                                unit_id == unit.id  ? <option id={unit.id}  value={unit.id}  selected={product.selected_unit_id == unit.id }>{unit.unit_name}</option>  : null
                                                            )
                                                        })
                                                    )
                                                })
                                            }
                                            </select>
                                        </div>                                        
                                    </div>
                                    <p id="unitPackageInfo"></p>
                                </div>
                                <div class="col-md-12">
                                        <p><input type="submit" value={product.selected_unit_id ?  "Update to Cart" :"Add to Cart" } class="btn btn-primary py-3 px-4" /></p>
                                </div>
                            </div>
                    </div>
                </div>
                </form>
            </div>
        </section>}
        <Footer />
    </Fragment>
    )
}