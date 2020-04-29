import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';


export function SimpleAlert({message, variant}){
    return(
        <Alert key="01" variant={variant} style={{padding:'0px', paddingLeft:'10px', marginTop:'10px'}}>
            {message}
        </Alert>
    )
}


export function LinkAlert(message1, message2,  variant, link, linkText){
    return(
        <Alert key="02" variant={variant}>
            {message1}
            <Alert.Link href={link}>{linkText}</Alert.Link>
            {message2}
        </Alert>
    )
}