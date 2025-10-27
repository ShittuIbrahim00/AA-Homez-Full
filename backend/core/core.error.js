/**
 * Slantapp code and properties {www.slantapp.io}
 */
class ErrorClass extends Error {
    constructor(msg, code) {
        super(msg);
        this.statusCode = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
export default ErrorClass;
