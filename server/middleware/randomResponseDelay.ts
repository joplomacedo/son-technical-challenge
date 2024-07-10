import { sleep, randomInt } from "~/utils/general";

export default defineEventHandler(async (event) => {
	await sleep(randomInt(400, 1200));
});
