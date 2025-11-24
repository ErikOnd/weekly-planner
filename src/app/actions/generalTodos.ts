"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@utils/supabase/server";
import { revalidatePath } from "next/cache";

export type FormState = {
	message?: string;
	error?: string;
	success?: boolean;
};

export async function saveGeneralTodo(_prevState: FormState, formData: FormData): Promise<FormState> {
	const todoId = formData.get("todoId") as string;

	if (todoId && todoId.trim().length > 0) {
		return updateGeneralTodo(_prevState, formData);
	} else {
		return createGeneralTodo(_prevState, formData);
	}
}

export async function createGeneralTodo(_prevState: FormState, formData: FormData): Promise<FormState> {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				error: "You must be logged in to create a task",
				success: false,
			};
		}
		const text = formData.get("text") as string;

		if (!text || text.trim().length === 0) {
			return {
				error: "Task text is required",
				success: false,
			};
		}

		const maxOrder = await prisma.generalTodo.findFirst({
			where: { userId: user.id },
			orderBy: { order: "desc" },
			select: { order: true },
		});
		await prisma.generalTodo.create({
			data: {
				userId: user.id,
				text: text.trim(),
				order: (maxOrder?.order ?? -1) + 1,
			},
		});

		revalidatePath("/");

		return {
			message: "Task created successfully",
			success: true,
		};
	} catch (error) {
		console.error("Error creating general todo:", error);
		return {
			error: "Failed to create task",
			success: false,
		};
	}
}

export async function getGeneralTodos() {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return [];
		}

		return await prisma.generalTodo.findMany({
			where: { userId: user.id },
			orderBy: { order: "asc" },
		});
	} catch (error) {
		console.error("Error fetching general todos:", error);
		return [];
	}
}

export async function deleteGeneralTodo(todoId: string): Promise<FormState> {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				error: "You must be logged in to delete a task",
				success: false,
			};
		}

		const todo = await prisma.generalTodo.findFirst({
			where: {
				id: todoId,
				userId: user.id,
			},
		});

		if (!todo) {
			return {
				error: "Task not found",
				success: false,
			};
		}

		await prisma.generalTodo.delete({
			where: { id: todoId },
		});

		revalidatePath("/");

		return {
			message: "Task deleted successfully",
			success: true,
		};
	} catch (error) {
		console.error("Error deleting general todo:", error);
		return {
			error: "Failed to delete task",
			success: false,
		};
	}
}

export async function updateGeneralTodo(_prevState: FormState, formData: FormData): Promise<FormState> {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				error: "You must be logged in to update a task",
				success: false,
			};
		}

		const todoId = formData.get("todoId") as string;
		const text = formData.get("text") as string;

		if (!todoId) {
			return {
				error: "Task ID is required",
				success: false,
			};
		}

		if (!text || text.trim().length === 0) {
			return {
				error: "Task text is required",
				success: false,
			};
		}

		const todo = await prisma.generalTodo.findFirst({
			where: {
				id: todoId,
				userId: user.id,
			},
		});

		if (!todo) {
			return {
				error: "Task not found",
				success: false,
			};
		}

		await prisma.generalTodo.update({
			where: { id: todoId },
			data: {
				text: text.trim(),
			},
		});

		revalidatePath("/");

		return {
			message: "Task updated successfully",
			success: true,
		};
	} catch (error) {
		console.error("Error updating general todo:", error);
		return {
			error: "Failed to update task",
			success: false,
		};
	}
}

export async function reorderGeneralTodos(todoIds: string[]): Promise<FormState> {
	try {
		const supabase = await createClient();
		const { data: { user }, error: authError } = await supabase.auth.getUser();

		if (authError || !user) {
			return {
				error: "You must be logged in to reorder tasks",
				success: false,
			};
		}

		await prisma.$transaction(
			todoIds.map((id, index) =>
				prisma.generalTodo.updateMany({
					where: {
						id,
						userId: user.id,
					},
					data: {
						order: index,
					},
				})
			),
		);

		revalidatePath("/");

		return {
			message: "Tasks reordered successfully",
			success: true,
		};
	} catch (error) {
		console.error("Error reordering general todos:", error);
		return {
			error: "Failed to reorder tasks",
			success: false,
		};
	}
}
