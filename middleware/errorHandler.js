const {constants} =require("../constants")
const errorHandler = (err,req,res,next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    let title = "Server Error";

    switch (statusCode) {
        case constants.NOT_FOUND:
            title = "Not Found";
            break;
        case constants.UNAUTHORIZED:
            title = "Unauthorized";
            break;
        case constants.FORBIDDEN:
            title = "Forbidden";
            break;
        case constants.VALIDATION_ERROR:
            title = "Validation Failed";
            break;
        case constants.SERVER_ERROR:
            title = "Server Error";
            break;
        default:
            // For any unhandled status codes, default to Server Error
            res.status(constants.SERVER_ERROR);
            title = "Server Error";
            break;
    }

    res.json({
        title: title,
        message: err.message,
        stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;