import { sleep, randomInt } from "~/utils/general";

export default defineEventHandler(async () => {
	await sleep(randomInt(400, 1200));
});
