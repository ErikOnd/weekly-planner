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

export async function getUserProfile() {
	try {
		const authResult = await getCurrentUser();
		if (!authResult.success) {
			return { success: false, error: authResult.error };
		}

		const profile = await prisma.profile.findUnique({
			where: { id: authResult.userId },
			select: {
				email: true,
				displayName: true,
			},
		});

		if (!profile) {
			return { success: false, error: "Profile not found" };
		}

		return {
			success: true,
			data: {
				email: profile.email,
				displayName: profile.displayName,
			},
		};
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return { success: false, error: "Failed to fetch profile" };
	}
}

export async function updateUserProfile(data: { displayName?: string; email?: string }) {
	try {
		const authResult = await getCurrentUser();
		if (!authResult.success) {
			return { success: false, error: authResult.error };
		}

		// Validate input
		if (data.displayName !== undefined && data.displayName.trim().length === 0) {
			return { success: false, error: "Display name cannot be empty" };
		}

		if (data.email !== undefined && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
			return { success: false, error: "Invalid email format" };
		}

		// Check if email is already taken by another user
		if (data.email !== undefined) {
			const existingUser = await prisma.profile.findFirst({
				where: {
					email: data.email,
					id: { not: authResult.userId },
				},
			});

			if (existingUser) {
				return { success: false, error: "Email is already in use" };
			}
		}

		const updatedProfile = await prisma.profile.update({
			where: { id: authResult.userId },
			data: {
				...(data.displayName !== undefined && { displayName: data.displayName }),
				...(data.email !== undefined && { email: data.email }),
			},
			select: {
				email: true,
				displayName: true,
			},
		});

		return {
			success: true,
			data: {
				email: updatedProfile.email,
				displayName: updatedProfile.displayName,
			},
		};
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { success: false, error: "Failed to update profile" };
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
