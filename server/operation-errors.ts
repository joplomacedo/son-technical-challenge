type Details = Record<string, any>;

class OperationError extends Error {
	statusCode: number;
	statusMessage: string;
	details: Details | null;
	srcError?: Error | null;

	constructor({
		statusMessage = "An error occurred",
		details = null,
		statusCode = 500,
		srcError = null,
	}: {
		statusMessage?: string;
		details?: Details | null;
		statusCode?: number;
		srcError?: Error | null;
	} = {}) {
		super(statusMessage);
		this.statusCode = statusCode;
		this.statusMessage = statusMessage;
		this.name = this.constructor.name;
		this.details = details;
		this.srcError = srcError;
		Error.captureStackTrace(this, this.constructor);
	}
}

class NotFoundError extends OperationError {
	constructor(statusMessage: string, details?: Details) {
		super({
			statusMessage,
			statusCode: 404,
			details,
		});
	}
}

class ConflictError extends OperationError {
	constructor(statusMessage: string, details?: Details) {
		super({
			statusMessage,
			statusCode: 409,
			details,
		});
	}
}

class ValidationError extends OperationError {
	constructor(statusMessage: string, details?: Details) {
		super({
			statusMessage,
			statusCode: 400,
			details,
		});
	}
}

class DatabaseError extends OperationError {
	constructor(statusMessage: string, details?: Details) {
		super({
			statusMessage,
			statusCode: 500,
			details,
		});
	}
}

class UnprocessableError extends OperationError {
	constructor(statusMessage: string, details?: Details) {
		super({
			statusMessage,
			statusCode: 422,
			details,
		});
	}
}

export {
	OperationError,
	NotFoundError,
	ValidationError,
	DatabaseError,
	ConflictError,
	UnprocessableError,
};
