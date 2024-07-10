import { OperationError } from "~/server/operation-errors";

export default function toNuxtError(
	error: unknown
): Parameters<typeof createError>[0] {
	if (error instanceof OperationError) {
		return {
			statusCode: error.statusCode,
			statusMessage: error.statusMessage,
			data: error.details,
		};
	} else {
		return {
			statusCode: 500,
			statusMessage:
				error instanceof Error ? error.message : "Internal server error",
		};
	}
}
