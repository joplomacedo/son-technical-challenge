import type { OperationError } from "./operation-errors";

type UpdateManyResultItem = {
	id: string;
} & (
	| {
			success: true;
	  }
	| {
			success: false;
			error: OperationError;
	  }
);

type UpdateManyResult = UpdateManyResultItem[];

type AddManyResultItem =
	| {
			id: string;
			success: true;
	  }
	| {
			success: false;
			error: OperationError;
	  };

type AddManyResult = AddManyResultItem[];

export type {
	UpdateManyResultItem,
	UpdateManyResult,
	AddManyResultItem,
	AddManyResult,
};
