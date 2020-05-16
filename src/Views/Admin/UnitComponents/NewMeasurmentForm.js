import React, {useState, useEffect, Fragment} from 'react';

//Components 
import UnitsAPI from '../../../api/units.js';
import {SimpleAlert} from '../../../common/Alert.js';

const RESET_VALUES = {
    unit_name : '',
    default_weight : '1',
}

export default function NewMeasurmentForm({setIsLoading}) {
    const [inputs, setInputs] = useState(RESET_VALUES);
    const [viewAlert, setViewAlert] = useState(false);
    const [alertParams, setAlertParams] = useState({});

    const handleInputChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {        
        e.preventDefault();
        setIsLoading(true);
        try{
            const result = await UnitsAPI.setNewUnit({
                unit_name : inputs.unit_name,
                default_weight: inputs.default_weight,
            });
            if(result.isSuccessful === true){
                setAlertParams({message: 'New unit has been added.', variant: "success", style: {}})
            }else if(result.isSuccessful === false){
                setAlertParams({message: 'Operation failed of new unit insertion.', variant: "danger", style: {}})
            }
            setViewAlert(true);
        }catch(error){
            console.log(error)
        }
        setInputs(RESET_VALUES);
        setIsLoading(false);        
    }

    return(
        <div class="col-md-12">
        {viewAlert ? <SimpleAlert {...alertParams} /> : ""}
            <form onSubmit={handleSubmit} >
                <div class="row align-items-end">
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="unit_name">Unit Name *</label>
                            <input id="unit_name" name="unit_name" type="text" class="form-control" value={inputs.unit_name} required onChange={handleInputChange} />
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <label for="default_weight">Minimum quantity for this new unit ? *</label>
                            <input id="default_weight" name="default_weight" type="number" step="0.01" min="1" class="form-control" value={inputs.default_weight} required onChange={handleInputChange} />
                        </div>
                    </div>
                    <div class="form-group p-4">
                        <input type="submit" value="Submit" class="btn  px-4 btn-primary" />
                    </div>
                </div>
            </form>
        </div>
    )
}