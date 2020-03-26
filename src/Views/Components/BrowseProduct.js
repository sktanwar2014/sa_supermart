import React, {useState, useEffect} from 'react';

//Components 
import CategoriesAPI from '../../api/categories.js';


export default function BrowseProduct() {

    const [mainCategory, setMainCategory] = useState([]);

    const getMainCategoryList = async () => {
        try{
            const result = await CategoriesAPI.getMainCategoryList();            
            setMainCategory(result.mainCategoriesList);
        }catch(e){
            console.log('Error...',e);
        }
    }
    
    useEffect(()=>{
        getMainCategoryList();
    },[]);

    return(
        <section className="cat_product_area section_gap">
		<div className="container-fluid">
            <div className="row">
             <div className="col-lg-3">
			 		<div className="left_sidebar_area">
			 			<aside className="left_widgets cat_widgets">
			 				<div className="l_w_title">
			 					<h3>Browse Categories</h3>
			 				</div>
			 				<div className="widgets_inner">
			 					<ul className="list">
                                     {(mainCategory.length > 0 ? mainCategory : []).map((top) => {
                                         if(top.type === 1 && top.parent_id === 0){
                                            return(
                                            <li> <a href="#"  >{top.category_name}</a>
                                                {(mainCategory.length > 0 ? mainCategory : []).map((middle) => {
                                                    if(middle.type === 2 && middle.parent_id === top.id){
                                                        return(
                                                            <ul className="list" style={{display: 'none'}}>
                                                                <li><a href="#">{middle.category_name}</a>
                                                                    {(mainCategory.length > 0 ? mainCategory : []).map((sub) => {
                                                                        if(sub.type === 3 && sub.parent_id === middle.id){
                                                                            return(
                                                                                <ul className="list" style={{display: 'none'}}>
                                                                                    <li><a href="#">{sub.category_name}</a></li>
                                                                                </ul>
                                                                                )
                                                                        }
                                                                    })}
                                                                </li>
                                                            </ul>
                                                            )
                                                    }
                                                })}
                                            </li>
                                            )
                                         }
                                     })}
			 					</ul>
			 				</div>
			 			</aside>
						
			 		</div>
			 	</div>
				 <div className="col-lg-9">
				 	<div className="product_top_bar">
				 		<div className="left_dorp" style={{display:'flex'}}>
				 			<select className="sorting" style={{display: 'block'}}>
				 				<option value="1">Default sorting</option>
				 				<option value="2">Default sorting 01</option>
				 				<option value="4">Default sorting 02</option>
                             </select>
                             {/* <div className="nice-select sorting" tabindex="0">
                                 <span className="current">Default sorting</span>
                                     <ul className="list">
                                         <li data-value="1" className="option selected">Default sorting</li>
                                         <li data-value="2" className="option">Default sorting 01</li>
                                         <li data-value="4" className="option">Default sorting 02</li>
                                     </ul>
                             </div> */}
				 			<select className="show" style={{display: 'block'}}>
				 				<option value="1">Show 12</option>
				 				<option value="2">Show 14</option>
				 				<option value="4">Show 16</option>
                             </select>
                             {/* <div className="nice-select show" tabindex="0">
                                 <span className="current">Show 12</span>
                                     <ul className="list">
                                         <li data-value="1" className="option selected">Show 12</li>
                                         <li data-value="2" className="option">Show 14</li>
                                         <li data-value="4" className="option">Show 16</li>
                                     </ul>
                             </div> */}
				 		</div>
				 		<div className="right_page ml-auto">
				 			<nav className="cat_page" aria-label="Page navigation example">
				 				<ul className="pagination">
				 					<li className="page-item">
				 						<a className="page-link" href="#">
				 							<i className="fa fa-long-arrow-left" aria-hidden="true"></i>
				 						</a>
				 					</li>
				 					<li className="page-item active">
				 						<a className="page-link" href="#">1</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">2</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">3</a>
				 					</li>
				 					<li className="page-item blank">
				 						<a className="page-link" href="#">...</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">6</a>
				 					</li>
				 					<li className="page-item">
				 						<a className="page-link" href="#">
				 							<i className="fa fa-long-arrow-right" aria-hidden="true"></i>
				 						</a>
				 					</li>
				 				</ul>
				 			</nav>
				 		</div>
				 	</div>
				 </div>				
			</div>

			 {/* <div className="row">
			 	<nav className="cat_page mx-auto" aria-label="Page navigation example">
			 		<ul className="pagination">
			 			<li className="page-item">
			 				<a className="page-link" href="#">
			 					<i className="fa fa-chevron-left" aria-hidden="true"></i>
			 				</a>
			 			</li>
			 			<li className="page-item active">
			 				<a className="page-link" href="#">01</a>
			 			</li>
			 			<li className="page-item">
			 				<a className="page-link" href="#">02</a>
			 			</li>
			 			<li className="page-item">
			 				<a className="page-link" href="#">03</a>
			 			</li>
			 			<li className="page-item blank">
			 				<a className="page-link" href="#">...</a>
			 			</li>
			 			<li className="page-item">
			 				<a className="page-link" href="#">09</a>
			 			</li>
			 			<li className="page-item">
			 				<a className="page-link" href="#">
			 					<i className="fa fa-chevron-right" aria-hidden="true"></i>
			 				</a>
			 			</li>
			 		</ul>
			 	</nav>
			 </div> */}
		</div>
	</section>
    )
}