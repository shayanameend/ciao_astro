import * as zod from "zod";

const envSchema = zod.object({
	PUBLIC_SERVER_URL: zod.string().url(),
});

const env = envSchema.parse(import.meta.env);

export { env };
