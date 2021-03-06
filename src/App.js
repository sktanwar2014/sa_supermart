import React, {Suspense, lazy, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

// Components
import {APP_TOKEN} from  './api/config/Constants.js'
import PageLoader from './Views/Partials/Loader';



const Login = lazy(()=> import('./Views/Auth/login.js'));
const ChangePassword = lazy(()=> import('./Views/Auth/ChangePassword.js'));
const Signup = lazy(()=> import('./Views/Auth/signup.js'));
const AdminHome = lazy(()=> import('./Views/Admin/AdminHome.js'));
const Home = lazy(()=> import('./Views/Home.js'));
const AddProduct = lazy(()=> import('./Views/Admin/AddProduct.js'));
const EditProduct = lazy(()=> import('./Views/Admin/EditProduct.js'));
const ViewProduct = lazy(()=> import('./Views/Admin/ViewProduct.js'));
const ViewOrder = lazy(()=> import('./Views/Admin/ViewOrder.js'));
const ViewOrderedProduct = lazy(()=> import('./Views/Admin/ViewOrderedProduct.js'));
const CartList = lazy(()=> import('./Views/Components/CartList.js'));
const ProceedToCheckout = lazy(()=> import('./Views/Components/ProceedToCheckout.js'));
const ViewOrderReport = lazy(()=> import('./Views/Admin/Report/ViewOrderReport.js'));
const ViewOrderedProductReport = lazy(()=> import('./Views/Admin/Report/ViewOrderedProductReport.js'));
const DeliveryForm = lazy(()=> import('./Views/Admin/DeliveryForm.js'));
const ProductVerification = lazy(()=> import('./Views/Components/ProductVerification.js'));
const ViewCustomerOrder = lazy(()=> import('./Views/Components/ViewCustomerOrder.js'));
const AlterCategories = lazy(()=> import('./Views/Admin/AlterCategories.js'));
const AlterSubCategories = lazy(()=> import('./Views/Admin/AlterSubCategories.js'));
const ViewProductDetails = lazy(()=> import('./Views/Admin/ViewProductDetails.js'));
const ProductDetails = lazy(()=> import('./Views/Components/CustomerViewProductDetails.js'));
const AlterUnits = lazy(()=> import('./Views/Admin/AlterUnits.js'));
const ClientsList = lazy(()=> import('./Views/Admin/ClientsList.js'));
const AutomationSettings = lazy(()=> import('./Views/Settings/AutomationSettings.js'));

// Invoices 
const MainInvoices = lazy(()=> import('./Views/Invoices/MainInvoices.js'));
const InvoiceUpdateRequest  = lazy(()=> import('./Views/Invoices/Franchise/UpdateRequest.js'));
const InvoicePaymentPanel  = lazy(()=> import('./Views/Invoices/Franchise/PaymentPanel.js'));
const ViewTransactionReceipt  = lazy(()=> import('./Views/Invoices/Admin/ViewTransactionReceipt.js'));
const HandleInvoiceRequest  = lazy(()=> import('./Views/Invoices/Admin/HandleInvoiceRequest.js'));


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
                  path="/handle-clients" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <ClientsList {...props} />
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
                  path="/edit-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <EditProduct  {...props} />
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
                <Route 
                  exact 
                  path="/alter-units" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AlterUnits {...props} />
                    : <Redirect to="/" /> 
                  }}                    
                />
                <Route 
                  exact 
                  path="/view-product-details" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : <ViewProductDetails {...props} /> 
                  }}                    
                />
                 <Route 
                  exact 
                  path="/product-details" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : <ProductDetails {...props} /> 
                  }}                    
                />
                 <Route 
                  exact 
                  path="/product-details" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : <ProductDetails {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/change-password" 
                  render = { props => {
                    return (APP_TOKEN.notEmpty) &&
                    <ChangePassword {...props} />
                  }}
                />
                <Route 
                  exact 
                  path="/auto-settings"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (!APP_TOKEN.isAdmin) &&
                    <AutomationSettings {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/invoices"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : <MainInvoices {...props} />
                  }}
                /> 
                <Route 
                  exact 
                  path="/invoices/update-request"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (!APP_TOKEN.isAdmin) &&
                    <InvoiceUpdateRequest {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/invoices/billpay"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (!APP_TOKEN.isAdmin) &&
                    <InvoicePaymentPanel {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/invoices/viewTransactionReceipt"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin) &&
                    <ViewTransactionReceipt {...props} /> 
                  }}
                />
                <Route 
                  exact 
                  path="/invoices/handleInvoiceRequest"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin) &&
                    <HandleInvoiceRequest {...props} />
                  }}
                />

                <Route exact path="/login"  render={props =>  <Login {...props} /> } />
                <Route exact path="/sign-up"  render={props =>  <Signup {...props} /> } />
                <Route exact path="/logout" render={props =>  <Redirect to="/login" /> }/>
                
              </Switch>
            </Suspense>
          </Router>      
  );
}

export default App;