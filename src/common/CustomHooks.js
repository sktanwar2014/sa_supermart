import { useState, useEffect } from 'react';

const useSignUpForm = (state, callback, validate) => {
  const [inputs, setInputs] = useState(state);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validDecimalNumber = /^\d*\.?\d*$/;
  const validNumber = /^[0-9]*$/;

  const handleSubmit = event => {
    // console.log('errors',errors)
    // console.log('inputs',inputs)
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    setErrors(validate(inputs, errors));
  };

  const cleanInputs = event =>{
    setInputs('');
  }
  
  useEffect(() => {
    if (Object.keys(errors).length === 0 && isSubmitting) {
      callback();
    }
  }, [errors]);

  const handleEditSubmit = event => {
    if(event){
      event.preventDefault();
    }
    callback();
  }

  const handleInputChange = e => {
    setInputs({
    ...inputs,
    [e.target.name]: e.target.value,
  });
  }

  const handleNumberInput = e => {
    if (e.target.value === '' || validNumber.test(e.target.value)) {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handlePriceInput = e => {
    if (e.target.value === '' || validDecimalNumber.test(e.target.value)) {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleReset = RESET_VALUES => {
    setInputs(inputs => RESET_VALUES);    
  };

  const setInput = (name, value) => {
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleRandomInput = (newInputArray) => {
    let inputscopy = inputs;
    (newInputArray.length > 0 ? newInputArray : []).map(data => {
      inputscopy[data.name] = data.value;
    })
    setInputs({...inputs, inputscopy});
    delete inputs['inputscopy'];
  }

  const setInputsAll = e => {
    setInputs(inputs => e);
  }

  const handleCheckBoxChange = name => event => {
    setInputs({
      ...inputs,
      [name]: event.target.checked,
    });
  };

  const handleDateChange = (name, date) => {
    setInputs({
      ...inputs,
      [name]: date,
    });
  }

  return {
    handleSubmit,
    handleInputChange,
    handleEditSubmit,
    inputs,
    handleReset,
    setInputsAll,
    setInput,
    errors,
    setErrors,
    isSubmitting,
    cleanInputs,
    handleNumberInput, 
    handlePriceInput,
    handleRandomInput,
    handleCheckBoxChange, 
    handleDateChange
  };
};

export default useSignUpForm;
