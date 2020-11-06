class ValidationError extends Error {
	constructor(message, allErrors) {
		super(message);
		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;
		this.status = 422;
		this.allErrors = allErrors;
	}
}

module.exports = ValidationError;
