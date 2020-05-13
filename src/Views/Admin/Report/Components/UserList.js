import React, { useEffect, useState, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export default function UserList({open, setUserDialogOpen, userList, handleUserDialogClose, isCheckedAll, setIsCheckedAll}) {
    
    const [users, setUsers] = useState(userList);
  
    useEffect(() => {
      if(isCheckedAll===true){
        let temp = [...users];
        const result = temp.map((data) => {
                        data.checked = isCheckedAll;
                        return data;
                      });
        setUsers(result);
      }
    },[]);

    const handleCheckBox = (e) => {
      let id = Number((e.target.name).split('-')[1]);
      let temp = [...users];      
      const result = temp.map((data) => {
                      if(id === data.id){ data.checked = e.target.checked; } 
                      return data;
                    });
      setUsers(result);

      const foundFalse = result.find(ele => ele.checked ===false);
      if(foundFalse !== undefined && foundFalse !== null){
        setIsCheckedAll(false);
      }else{
        setIsCheckedAll(true);
      }
    }


    const handleAllCheckBox = (e) => {
      setIsCheckedAll(e.target.checked);
      let temp = [...users];
      const result = temp.map((data) => {
                      data.checked = e.target.checked;
                       return data;
                    });
      setUsers(result);
    }

    const handleSubmit = () => {
      handleUserDialogClose(users);
    }

    return (
      <Fragment>
          <Modal show = {open} onHide={()=>{setUserDialogOpen(false)}} size="sm" centered >
            <Modal.Header closeButton >
              <Modal.Title id="contained-modal-title-vcenter">
                User List
              </Modal.Title>
            </Modal.Header>
              <Modal.Body>
                <ul class="list-group list-group-flush overflow-of-list">
                      <li class="list-group-item">
                        <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id={'user-0'} name={'user-0'} checked= {isCheckedAll} onChange={handleAllCheckBox} />
                          <label class="custom-control-label" for={'user-0'}>All</label>
                        </div>
                      </li>
                  {(users.length > 0 ? users : []).map((data, index) => {
                    return(
                      <li class="list-group-item">
                        <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id={'user-'+data.id} name={'user-'+data.id}  onChange={handleCheckBox} checked={data.checked} />
                          <label class="custom-control-label" for={'user-'+data.id}>{data.name}</label>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </Modal.Body>
              <Modal.Footer>
                <Button className="br-none" onClick={()=>{setUserDialogOpen(false)}}>Close</Button>
                <Button type="submit" className="br-none" onClick={handleSubmit}>Submit</Button>
              </Modal.Footer>
          </Modal>
      </Fragment>
    );
  }
  