"use client";

import type { GeneralTodo } from "@prisma/client";
import { useCallback, useEffect, useOptimistic, useState, useTransition } from "react";
import { deleteGeneralTodo, getGeneralTodos } from "../app/actions/generalTodos";

type OptimisticAction =
	| { type: "add"; todo: GeneralTodo }
	| { type: "update"; todoId: string; text: string }
	| { type: "delete"; todoId: string };

export function useGeneralTodos() {
	const [todos, setTodos] = useState<GeneralTodo[]>([]);
	const [optimisticTodos, addOptimisticUpdate] = useOptimistic(
		todos,
		(state, action: OptimisticAction) => {
			switch (action.type) {
				case "add":
					return [...state, action.todo];
				case "update":
					return state.map(todo => todo.id === action.todoId ? { ...todo, text: action.text } : todo);
				case "delete":
					return state.filter(todo => todo.id !== action.todoId);
				default:
					return state;
			}
		},
	);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const fetchTodos = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getGeneralTodos();
			setTodos(data);
		} catch (fetchError) {
			setError("Failed to load todos");
			console.error("Error fetching todos:", fetchError);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const silentRefresh = useCallback(async () => {
		try {
			const data = await getGeneralTodos();
			setTodos(data);
		} catch (fetchError) {
			console.error("Error refreshing todos:", fetchError);
		}
	}, []);

	const deleteTodo = useCallback(async (todoId: string) => {
		startTransition(() => {
			addOptimisticUpdate({ type: "delete", todoId });
		});

		try {
			const result = await deleteGeneralTodo(todoId);
			if (result.success) {
				setTodos(prev => prev.filter(todo => todo.id !== todoId));
			} else {
				await fetchTodos();
			}
		} catch (fetchError) {
			await fetchTodos();
			console.error("Error deleting todo:", fetchError);
		}
	}, [fetchTodos]);

	const addTodo = useCallback((todo: GeneralTodo) => {
		startTransition(() => {
			addOptimisticUpdate({ type: "add", todo });
		});
	}, []);

	const updateTodo = useCallback((todoId: string, text: string) => {
		startTransition(() => {
			addOptimisticUpdate({ type: "update", todoId, text });
		});
	}, []);

	return {
		todos: optimisticTodos,
		loading,
		error,
		isPending,
		deleteTodo,
		addTodo,
		updateTodo,
		refresh: fetchTodos,
		silentRefresh,
	};
}
