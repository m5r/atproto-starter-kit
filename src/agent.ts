import bsky from "@atproto/api";
import * as dotenv from "dotenv";
import process from "node:process";
dotenv.config();

const agent = new bsky.BskyAgent({
	service: "https://bsky.social",
});

await agent.login({
	identifier: process.env.BSKY_USERNAME!,
	password: process.env.BSKY_PASSWORD!,
});

export default agent;
