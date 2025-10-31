import { createClient as createClientPrimitive } from "@supabase/supabase-js";

export function createClient() {
	return createClientPrimitive(
		process.env.SUPABASE_URL!,
		process.env.SUPABASE_PUBLISHABLE_KEY!,
	);
}
