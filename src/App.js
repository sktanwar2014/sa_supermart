import React, {Suspense, lazy, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

// Components
import {APP_TOKEN} from  './api/config/Constants.js'
import PageLoader from './Views/Partials/Loader';


const Login = lazy(()=> import('./Views/Auth/login'));
const AdminHome = lazy(()=> import('./Views/Admin/AdminHome'));
const Home = lazy(()=> import('./Views/Home'));
const AddProduct = lazy(()=> import('./Views/Admin/AddProduct.js'));
const ViewProduct = lazy(()=> import('./Views/Admin/ViewProduct.js'));
const ViewOrder = lazy(()=> import('./Views/Admin/ViewOrder.js'));
const ViewOrderedProduct = lazy(()=> import('./Views/Admin/ViewOrderedProduct.js'));
const CartList = lazy(()=> import('./Views/Components/CartList.js'));
const ProceedToCheckout = lazy(()=> import('./Views/Components/ProceedToCheckout.js'));
const ViewOrderReport = lazy(()=> import('./Views/Admin/Report/ViewOrderReport.js'));
const ViewOrderedProductReport = lazy(()=> import('./Views/Admin/Report/ViewOrderedProductReport.js'));
const DeliveryForm = lazy(()=> import('./Views/Admin/DeliveryForm.js'));
const ProductVerification = lazy(()=> import('./Views/Components/ProductVerification.js'));
const ViewCustomerOrder = lazy(()=> import('./Views/Components/ViewCustomerOrder'));
const AlterCategories = lazy(()=> import('./Views/Admin/AlterCategories'));
const AlterSubCategories = lazy(()=> import('./Views/Admin/AlterSubCategories'));

function App() {
  return (
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route 
                  exact 
                  path="/"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <Redirect to="/view-added-product" />
                    : <Home {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/cart-list" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <Redirect to="/view-added-product" />
                    : <CartList {...props} /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/proceed-to-checkout" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <Redirect to="/view-added-product" />
                    : <ProceedToCheckout {...props} />
                  }}
                />
                <Route 
                  exact 
                  path="/add-new-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AddProduct {...props} />
                    : <Redirect to="/" /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/view-user-order-list" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <Redirect to="/view-added-product" />
                    : <ViewCustomerOrder {...props} />}}                    
                />
                <Route 
                  exact 
                  path="/view-added-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ViewProduct {...props} />
                    : <Redirect to="/" /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/view-order-list" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ViewOrder {...props} />
                    : <Redirect to="/" />
                  }}                    
                />
                 <Route 
                  exact 
                  path="/view-ordered-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ViewOrderedProduct {...props} />
                    : <Redirect to="/" />
                  }}                    
                />
               <Route 
                  exact 
                  path="/view-order-report" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ViewOrderReport {...props} />
                    : <Redirect to="/" />
                  }}                    
                />
                 <Route 
                  exact 
                  path="/view-ordered-product-report" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ViewOrderedProductReport {...props} />
                    : <Redirect to="/" /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/delivery-form" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <DeliveryForm {...props} />
                    : <Redirect to="/" /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/verify-delivered-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <Redirect to="/view-added-product" />
                    : <ProductVerification  {...props} /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/alter-categories" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AlterCategories  {...props} />
                    : <Redirect to="/" /> 
 
                  }}                    
                />
                <Route 
                  exact 
                  path="/alter-categories/subcategory" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AlterSubCategories  {...props} />
                    : <Redirect to="/" /> 
 
                  }}                    
                />
               
                <Route exact path="/login"  render={props =>  <Login {...props} /> } />
                <Route exact path="/logout" render={props =>  <Redirect to="/login" /> }/>
                
              </Switch>
            </Suspense>
          </Router>      
  );
}

export default App;