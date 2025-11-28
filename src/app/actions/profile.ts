"use server";

import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function checkUserExists() {
	try {
		const authResult = await getCurrentUser();
		if (!authResult.success) {
			return { success: false, error: authResult.error };
		}

		const profile = await prisma.profile.findUnique({
			where: { id: authResult.userId },
		});

		if (!profile) {
			return { success: false, error: "Profile not found" };
		}

		return { success: true };
	} catch (error) {
		console.error("Error checking if user exists:", error);
		return { success: false, error: "Failed to check user" };
	}
}

export async function createNewUser(displayName?: string) {
	try {
		const { createClient } = await import("@utils/supabase/server");
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return { success: false, error: "Not authenticated" };
		}

		if (!user.email_confirmed_at) {
			return { success: false, error: "Email not verified" };
		}

		const userDisplayName = displayName || (user.user_metadata?.displayName as string) || "";

		await prisma.profile.create({
			data: {
				id: user.id,
				email: user.email ?? "",
				displayName: userDisplayName,
			},
		});

		return { success: true };
	} catch (error) {
		console.error("Error creating new user:", error);
		return { success: false, error: "Failed to create user" };
	}
}
