import { setTimeout as sleep } from "node:timers/promises";

import { processNotifications } from "./bot.js";

while (true) {
	await processNotifications();
	await sleep(1000);
}
