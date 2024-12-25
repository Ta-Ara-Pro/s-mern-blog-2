export const errorHandler = (statusCode, message) => {

    // we don't have error initially so we create an error using error constructor from javascript
    const error = new Error();
   
    error.statusCode = statusCode;
    error.message = message;
    return error;
}