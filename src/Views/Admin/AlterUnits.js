import React, {useState, useEffect, Fragment} from 'react';



//Components 

import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import BundleUnitForm from './UnitComponents/BundleUnitForm.js';
import NewMeasurmentForm from './UnitComponents/NewMeasurmentForm.js';
import NewUnitForExisting from './UnitComponents/NewUnitForExisting.js';


import CallLoader from '../../common/Loader.js';

export default function AlterUnits(props) {

    const [userChoise, setUserChoise] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const handleUserChoise = (e) => {
        setUserChoise(Number(e.target.value));
    }

    return(
    <Fragment>
        <Header />       
            <section class="ftco-section">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-xl-12 ftco-animate fadeInUp ftco-animated">
                            <div class="row">
                                <div class="col-md-6 col-lg-6">
                                    <h3 class="billing-heading">Unit Setup</h3>
                                </div>
                                {/* <div class="col-md-6 col-lg-6" >
                                    <input type="button" class="btn btn-primary br-none f-right" onClick={()=>{addUpdateCategoriesDialog({id:'', category_name:''}, 'add')}} value="Add New" />
                                </div> */}
                            </div>
                            <div class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="radio">
                                            <label><input type="radio" name="unitType" value="1" class="mr-2" onClick={handleUserChoise} /> Is this new unit act as a bundle of goods ? (Ex. Box, Packet.)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="radio">
                                            <label><input type="radio" name="unitType" value="2" class="mr-2" onClick={handleUserChoise} /> Is this new unit act as completly new measurement for goods ? (Ex. KG, Litre.)</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <div class="radio">
                                            <label><input type="radio" name="unitType" value="3" class="mr-2" onClick={handleUserChoise} /> Or it's a part of existing unit ? (Ex. Grams under KG, Quintal over KG.)</label>
                                            </div>
                                        </div>
                                    </div>
                                    {(userChoise === 1) && <BundleUnitForm setIsLoading={setIsLoading} /> }
                                    {(userChoise === 2) && <NewMeasurmentForm setIsLoading={setIsLoading} /> }
                                    {(userChoise === 3) && <NewUnitForExisting /> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <Footer />
            {isLoading ?   <CallLoader />   : null  }
    </Fragment>
    )
}