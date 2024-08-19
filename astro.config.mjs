import { defineConfig } from "astro/config";

import { default as tailwind } from "@astrojs/tailwind";
import { default as svelte } from "@astrojs/svelte";
import { default as vue } from "@astrojs/vue";

export default defineConfig({
	integrations: [tailwind(), svelte(), vue()],
});
