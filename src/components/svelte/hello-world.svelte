<script lang="ts">
import { default as events } from "../../config/events";
import { useRef, useStore, useEffect } from "../../hooks/core.svelte";
import { socketStore } from "../../stores/socket";
import {
	ChatRoomJoinResponseSchema,
	type ChatRoomJoinResponse,
} from "../../validators/chat.validators";

const chatRoom = useRef<ChatRoomJoinResponse["room"]>(null);

useStore(socketStore, async (socket) => {
	try {
		if (socket) {
			const { error, data } = await socket.emitWithAck(events.chat.room.join, {
				otherUserId: "aa624179-5634-431b-96ea-5bd0f083bf69",
			});

			if (error) {
				throw new Error(error);
			}

			const parsedResponse = ChatRoomJoinResponseSchema.parse(data);

			chatRoom.value = parsedResponse.room;
		}
	} catch (error) {
		console.error(error);
	}
});

useEffect(() => {
	console.log(chatRoom.value?.id);
});
</script>

<section>
	<span>{chatRoom.value?.id}</span>
	{#if chatRoom.value?.messages && chatRoom.value.messages.length > 0}
	<ul>
		{#each chatRoom.value.messages as message}
		<li>
			<article>
				<h2>{message.profile.fullName}</h2>
				<p>{message.text}</p>
				<span>{message.isRead ? "Read" : "Unread"}</span>
			</article>
		</li>
		{/each}
	</ul>
	{:else}
		<p>No messages</p>
	{/if}
</section>
