import bsky from "@atproto/api";

import agent from "./agent.js";

export async function processNotifications() {
	const notifications = await agent.listNotifications();
	for (const notification of notifications.data.notifications) {
		if (notification.isRead) {
			continue;
		}

		console.log(notification);
		if (notification.reason == "follow") {
			await agent.follow(notification.author.did);
		}

		if (notification.reason == "mention" || notification.reason == "reply") {
			if (bsky.AppBskyFeedPost.isRecord(notification.record)) {
				await agent.like(notification.uri, notification.cid);
				const parent = { uri: notification.uri, cid: notification.cid };
				const text = "You can find the code for this bleet >>>here<<<, with a link card, a title and a description!";
				await agent.post({
					reply: {
						root: notification.record.reply?.root ?? parent,
						parent,
					},
					text,
					facets: [
						{
							index: { byteStart: text.indexOf(">>>") + 3, byteEnd: text.indexOf("<<<") },
							features: [
								{
									$type: "app.bsky.richtext.facet#link",
									uri: "https://github.com/aliceisjustplaying/atproto-starter-kit",
								},
							],
						},
					],
					embed: {
						$type: "app.bsky.embed.external",
						external: {
							uri: "https://github.com/aliceisjustplaying/atproto-starter-kit",
							title: "alice's atproto starter kit",
							description: "i'm just playing around with the api",
						},
					},
				});
			}
		}

		await agent.updateSeenNotifications(notification.indexedAt);
	}
	await agent.updateSeenNotifications(notifications.data.notifications[0].indexedAt);
}
