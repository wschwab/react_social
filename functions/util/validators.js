const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
};

const isEmpty = string => {
    if(string.trim() === '') return true;
    else return false;
};

exports.validateSignupData = data => {
    let errors = {};

    if(isEmpty(data.email)) {
        errors.email = "Email field required";
    } else if(!isEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }

    if(isEmpty(data.password)) errors.password = "Password field required";
    if(data.password !== data.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if(isEmpty(data.handle)) errors.handle = "Handle field required";

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateLoginData = data => {
    let errors = {};

    if(isEmpty(data.email)) errors.email = "Email field required";
    if(!isEmail(data.email)) errors.email = "Invalid email";
    if(isEmpty(data.password)) errors.password = "Password field required";

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};
