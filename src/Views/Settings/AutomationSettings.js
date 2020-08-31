import React, {useState, useEffect, Fragment} from 'react';

//Components 

import Header from '../Partials/Header.js';
import Footer from '../Partials/Footer.js';
import CallLoader from '../../common/Loader.js';

// APIs
import SettingsAPI from '../../api/settings.js';

export default function AutomationSettings(props) {

    const [settingList, setSettingList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSetting();
    },[]);

    const fetchSetting = async () => {
            setIsLoading(true);
        try{
            const result = await SettingsAPI.getSettings({type: 'AUTOMATION'});
            setSettingList(result.settingList);
            setIsLoading(false);
        }catch(e){
            console.log("Error...",e);
        }
    }

    const handleChange = (e) => {
        let id = Number(String(e.target.name).split('-')[1]);
        let checked = (e.target.checked === true) ? 1 : 0;
        let temp = [...settingList];
        (temp.length > 0 ? temp : []).map(data => {
            if(data.setting_list_id === id){
                data.is_active = checked;
            }
        });
       setSettingList(temp);
    }


    const handleSubmit = async () => {
        setIsLoading(true);
        try{
            const result = await SettingsAPI.updateAutomationSettings({ settingList: settingList, type: 'AUTOMATION' });
            setSettingList(result.settingList);
            setIsLoading(false);
            alert('Updated Successfully');
            
        }catch(e){
            console.log("Error...",e);
        }
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
                                    <h3 class="billing-heading">Automation Settings</h3>
                                </div>
                                {/* <div class="col-md-6 col-lg-6" >
                                    <input type="button" class="btn btn-primary br-none f-right" onClick={()=>{addUpdateCategoriesDialog({id:'', category_name:''}, 'add')}} value="Add New" />
                                </div> */}
                            </div>
                            <div class="p-5 bg-light b-top-dark">
                                <div class="row align-items-end">
                                    <div class="w-100 table-div" >
                                        <table className="table table-td">
                                            <thead>
                                                <tr>
                                                    <th style={{minWidth : '250px', textAlign: 'left'}}>Setting List</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(settingList.length > 0 ? settingList : []).map(data => {
                                                    return(
                                                        <tr>
                                                            <td style={{ padding: '15px 20px', textAlignLast: 'left'}}>
                                                                <ul style={{margin: '0rem'}}>
                                                                    <li>
                                                                        {data.description}
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                            <td>
                                                                <div class="radio">
                                                                    <label> {data.is_active === 0 ? `Enable` : 'Disable'} &nbsp;&nbsp;&nbsp;
                                                                        <input type="checkbox" checked ={data.is_active} name={`isChecked-`+ data.setting_list_id} onChange={handleChange} />
                                                                    </label>
                                                                </div>
                                                            </td>
                                                        </tr>   
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="col-md-12 m-bottom-20" style ={{marginTop: '20px'}}>
                                        <div class="form-group">
                                            <div class="d-flex f-right">
                                                <button class="btn btn-primary px-4" onClick={handleSubmit}> Save Changes </button>
                                            </div>
                                        </div>
                                    </div>
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