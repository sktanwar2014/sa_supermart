import React, {useState, useEffect, Fragment} from 'react';
import {Link} from 'react-router-dom';

//Components
import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import {API_URL} from '../../api/config/Constants.js';

import StaticAPI from '../../api/static.js';

export default function ViewProductDetails(props) {
    const [product, setProduct] = useState({});
    const [productUnitList, setProductUnitList] = useState([]);

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
        <section class="ftco-section">
            <div class="container">
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
                                <div class="col-md-6">
                                    <label for="description">Available Units</label>
                                    <div class="form-group d-flex">
                                        <div class="select-wrap">
                                            <div class="icon"><span class="ion-ios-arrow-down"></span></div>
                                            <select name="" id="" class="form-control">
                                               {(productUnitList.length > 0 ? productUnitList : [] ).map((unit)=>{
                                                    return(
                                                        Object.values((product.unit_id).split(',')).map(unit_id => {
                                                            return(
                                                                unit_id == unit.id  ? <option id={unit.id}  value={unit.id}>{unit.unit_name}</option>  : null
                                                            )
                                                        })
                                                    )
                                                })
                                            }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                		<p><Link class="btn btn-black py-3 px-5" to={{pathname: '/edit-product', state:{productId: product.id}}}>Edit</Link></p>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </Fragment>
    )
}