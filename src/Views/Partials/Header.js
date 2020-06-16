import React,{Fragment, useState, useEffect} from 'react';
import {APP_TOKEN, CART_TOKEN} from '../../api/config/Constants.js';

export default function Header() {
    const userId = APP_TOKEN.get().userId;
    const roleId = APP_TOKEN.get().role_id;
    const [cartTotal, setCartTotal] = useState(CART_TOKEN.get().cartTotal);
    
    useEffect(() => {
        setCartTotal(CART_TOKEN.get().cartTotal)
    })
    
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
                                <a className="dropdown-item" href="/view-order-list">View Customer Wise</a>
                                <a className="dropdown-item" href="/view-ordered-product">View Product Wise</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Reports</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/view-order-report">Order Report</a>
                                <a className="dropdown-item" href="/view-ordered-product-report">Ordered Product Report</a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Settings</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/change-password">Change Password</a>
                                <hr />
                                <a className="dropdown-item" href="/alter-categories">Categories</a>                                
                                <a className="dropdown-item" href="/alter-units">Units</a>
                                <a className="dropdown-item" href="/handle-clients">Clients</a>
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
                                <a className="dropdown-item" href="/view-user-order-list">View </a>
                            </div>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Settings</a>
                            <div className="dropdown-menu" aria-labelledby="dropdown04">
                                <a className="dropdown-item" href="/change-password">Change Password</a>
                            </div>
                        </li>
                        <li className="nav-item cta cta-colored"><a href="/cart-list" className="nav-link"><span className="icon-shopping_cart"></span>[{cartTotal}]</a></li>
                        <li className="nav-item"><a href="/logout" className="nav-link">Logout</a></li> 
                    </ul>
                }
                
                {/* <li className="nav-item"><a href="#" className="nav-link">About</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Blog</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Contact</a></li> */}
            </div>
            </div>
        </nav>
  </Fragment>
 )
}