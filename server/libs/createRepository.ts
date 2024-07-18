import {
	NotFoundError,
	ConflictError,
	OperationError,
} from "@/server/operation-errors";

import { AddManyResult } from "@/server/operation-results";

type RepoId = string;
class Repository<
	RepoItem extends {
		id: RepoId;
	},
> {
	private items: RepoItem[] = [];
	private lastIdNum = 0;

	generateId(): RepoId {
		const id = (++this.lastIdNum).toString();

		if (this.items.some((item) => item.id === id)) {
			return this.generateId();
		}

		return id;
	}

	has(id: RepoId): boolean {
		return this.items.some((item) => item.id === id);
	}

	get(id: RepoId): RepoItem {
		const item = this.items.find((item) => item.id === id);

		if (item) {
			return item;
		}

		throw new NotFoundError(`RepoItem with id ${id} not found`);
	}

	getMany(ids: RepoId[]): RepoItem[] {
		return this.items.filter((item) => ids.includes(item.id));
	}

	getAll(): RepoItem[] {
		return this.items;
	}

	add(item: RepoItem | Omit<RepoItem, "id">): RepoItem {
		let id: RepoId;

		if ("id" in item) {
			if (this.items.some((existingItem) => existingItem.id === item.id)) {
				throw new ConflictError(`RepoItem with id ${item.id} already exists`, {
					details: {
						duplicateId: item.id,
					},
				});
			}

			id = item.id;
		} else {
			id = this.generateId();
		}

		const newItem = {
			...item,
			id,
		} as RepoItem;

		this.items.push(newItem);
		return newItem;
	}

	addMany(items: (RepoItem | Omit<RepoItem, "id">)[]): {
		items: RepoItem[];
		results: AddManyResult;
	} {
		let results: AddManyResult = [];
		let repoItems: RepoItem[] = [];

		items.forEach((item) => {
			try {
				const repoItem = this.add(item);
				repoItems.push(repoItem);

				results.push({
					id: repoItem.id,
					success: true,
				});
			} catch (error: any) {
				results.push({
					success: false,
					error:
						error instanceof OperationError
							? error
							: new OperationError({ srcError: error }),
				});
			}
		});

		return {
			items: repoItems,
			results,
		};
	}

	updatePartial(id: RepoId, itemUpdates: Partial<RepoItem>): RepoItem {
		const item = this.get(id);

		if (!item) {
			throw new NotFoundError(`RepoItem with id ${id} not found`);
		}

		Object.assign(item, {
			...itemUpdates,
			id,
		});

		return item;
	}

	update(id: RepoId, newItem: RepoItem | Omit<RepoItem, "id">): RepoItem {
		const existingItem = this.get(id);

		if (!existingItem) {
			throw new NotFoundError(`RepoItem with id ${id} not found`);
		}

		const index = this.items.findIndex((item) => item.id === id);

		this.items[index] = {
			...newItem,
			id,
		} as RepoItem; // TODO: fix this type assertion;

		return this.items[index];
	}

	remove(id: RepoId) {
		const index = this.items.findIndex((item) => item.id === id);

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}

export default <RepoItem extends { id: RepoId }>() =>
	new Repository<RepoItem>();

export type { RepoId };
