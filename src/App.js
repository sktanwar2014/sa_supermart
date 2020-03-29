import React, {Suspense, lazy} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';

import {APP_TOKEN} from  './api/config/Constants.js'
import PageLoader from './Views/Partials/Loader';

const Login = lazy(()=> import('./Views/Auth/login'));
const AdminHome = lazy(()=> import('./Views/Admin/AdminHome'));
const Home = lazy(()=> import('./Views/Home'));
const AddProduct = lazy(()=> import('./Views/Admin/AddProduct.js'));




function App() {
 
  return (
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Switch>
                {/* <Route exact path="/" component={Index} />
                <Route exact path="/editor"  render={props => { return <Editor {...props.location.state} /> }}  />
                <Route exact path="/OurTechnology" component={OurTechnology} />
                <Route exact path="/Services" component={Services} />
                <Route exact path="/Contact" component={Contact} />
                <Route exact path="/About" component={About} />
                <Route exact path="/WhyUs" component={WhyUs} />
                <Route exact path="/OurGoals" component={OurGoals} />
                <Route exact path="/OurPartners" component={OurPartners} />
                <Route exact path="/Portfolio" component={Portfolio} />                
                <Route exact path="/login" render={props => { return <Login {...props} /> }}   />      */}
                
                <Route 
                  exact 
                  path="/"
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AdminHome {...props} />
                    : <Home {...props} /> }}
                />
                <Route 
                  exact 
                  path="/add-new-product" 
                  render = { props => {
                    return (!APP_TOKEN.notEmpty)
                    ? <Redirect to="/login" />
                    : (APP_TOKEN.isAdmin)
                    ? <AddProduct {...props} />
                    : <Redirect to="/" /> }}                    
                />
                
                <Route exact path="/login"  render={props =>  <Login {...props} /> } />
                <Route exact path="/logout" render={props =>  <Redirect to="/login" /> }/>
                
                
                
                {/* <Route exact path="/home" render={props => { return APP_TOKEN.notEmpty ? <Index {...props}/> :  <Redirect to="/login" /> }} />
                <Route exact path="/editor"  render={props => { return APP_TOKEN.notEmpty ? <Editor {...props}  />  :  <Redirect to="/login" />  }}  />
                <Route exact path="/OurTechnology" render={props => { return APP_TOKEN.notEmpty ? <OurTechnology  {...props}/>  :  <Redirect to="/login" />  }} />
                <Route exact path="/Services" render={props => { return APP_TOKEN.notEmpty ? <Services {...props}/>  :  <Redirect to="/login" />  }} />
                <Route exact path="/Contact" render={props => { return APP_TOKEN.notEmpty ? <Contact {...props} />  :  <Redirect to="/login" />  }} />
                <Route exact path="/About" render={props => { return APP_TOKEN.notEmpty ? <About  {...props}/>  :  <Redirect to="/login" />  }} />
                <Route exact path="/WhyUs" render={props => { return APP_TOKEN.notEmpty ? <WhyUs  {...props}/>  :  <Redirect to="/login" />  }}  />
                <Route exact path="/OurGoals" render={props => { return APP_TOKEN.notEmpty ? <OurGoals  {...props}/>  :  <Redirect to="/login" />  }} />
                <Route exact path="/OurPartners" render={props => { return APP_TOKEN.notEmpty ? <OurPartners {...props} />  :  <Redirect to="/login" />  }} />
                <Route exact path="/Portfolio" render={props => { return APP_TOKEN.notEmpty ? <Portfolio {...props} />  :  <Redirect to="/login" />  }} />                 */}
                
              </Switch>
            </Suspense>
          </Router>      
  );
}

export default App;