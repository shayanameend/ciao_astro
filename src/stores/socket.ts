import { atom, onMount } from "nanostores";
import { io, type Socket } from "socket.io-client";
import { env } from "../lib/env";
import { default as events } from "../config/events";

const socketStore = atom<Socket | null>(null);

onMount(socketStore, () => {
	const socket = io(env.PUBLIC_SERVER_URL, {
		auth: {
			token:
				"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ2NzY3YzM1LTkzMjUtNDQ1My04ZjU4LTVhOTQyNjFhMjQ2MiIsImVtYWlsIjoic2FyYWhAeW9wbWFpbC5jb20iLCJ0b2tlblR5cGUiOiJ2ZXJpZmljYXRpb24iLCJkZXZpY2VUb2tlbiI6InF3ZXJ0eXVpb3AiLCJkZXZpY2VUeXBlIjoiaW9zIiwiaWF0IjoxNzI0MDAxMzQyfQ.5ZBcd2uX6rSczspn7FUozTzhHfKQR8jPDvs6Hj8XHYo",
		},
	});

	socket.on(events.socket.connect, () => {
		socketStore.set(socket);
	});

	socket.on(events.socket.connect_error, (error) => {
		socketStore.set(null);

		console.error(error);
	});

	socket.on(events.socket.disconnect, () => {
		socketStore.set(null);
	});

	socket.on(events.socket.error, (error) => {
		socketStore.set(null);
	});
});

export { socketStore };
