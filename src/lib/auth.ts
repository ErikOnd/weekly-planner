"use server";

import { createClient } from "@utils/supabase/server";

export type AuthResult<T = void> =
	| { success: true; userId: string; data?: T }
	| { success: false; error: string };

/**
 * Centralized authentication helper to reduce code duplication
 * Returns the authenticated user ID or an error
 */
export async function getCurrentUser(): Promise<AuthResult> {
	const supabase = await createClient();
	const { data: { user }, error: authError } = await supabase.auth.getUser();

	if (authError || !user) {
		return {
			success: false,
			error: "You must be logged in to perform this action",
		};
	}

	return {
		success: true,
		userId: user.id,
	};
}
