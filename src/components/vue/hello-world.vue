<script setup lang="ts">
import { useStore } from "../../hooks/core.vue";
import { socketStore } from "../../stores/socket";

useStore(socketStore, (socket) => {
	if (socket) {
		console.log(socket);
	}
});
</script>

<template>
  <h1>Hello World</h1>
</template>
