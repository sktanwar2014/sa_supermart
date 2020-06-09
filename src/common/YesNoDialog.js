import React, {Fragment} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default function YesNoDialog({open, handleClose, props}) {
    return (
      <Fragment>
        <Modal
          show={open}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {props.body}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {handleClose(0, props.data)}}> No</Button>
            <Button variant="primary" onClick={() => {handleClose(1, props.data)}}>Yes</Button>
          </Modal.Footer>
        </Modal>
    </Fragment>
    );
  }
  