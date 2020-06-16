import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';


export function SimpleAlert({message, variant, style}){
    return(
        <Alert key="01" variant= {variant} style={style}>
            {message}
        </Alert>
    )
}


export function LinkAlert(alertParams){
    return(
        <Alert key="02" variant={alertParams.variant} style = {{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}>
            {alertParams.message1}
            <Alert.Link href={alertParams.link}>{alertParams.linkText}</Alert.Link>
            {alertParams.message2}
        </Alert>
    )
}