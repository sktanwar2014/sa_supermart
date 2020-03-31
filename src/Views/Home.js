import React,{Fragment} from 'react';

// Components
import Header from './Partials/Header.js';
import Footer from './Partials/Footer.js';
import BrowseProduct from './Components/BrowseProduct.js';

export default function Home(props) {
 return(

            <BrowseProduct {...props} />
    
 )
}