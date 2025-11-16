import { useCallback, useEffect, useRef, useState } from "react";

const DELETE_DELAY = 5000;

export function useTodoToggle(deleteTodo: (todoId: string) => Promise<void>) {
	const [checkedTodos, setCheckedTodos] = useState<Set<string>>(new Set());
	const deletionTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

	const handleTodoToggle = useCallback((todoId: string, checked: boolean) => {
		const existingTimeout = deletionTimeoutsRef.current.get(todoId);
		if (existingTimeout) {
			clearTimeout(existingTimeout);
			deletionTimeoutsRef.current.delete(todoId);
		}

		setCheckedTodos(prev => {
			const next = new Set(prev);
			checked ? next.add(todoId) : next.delete(todoId);
			return next;
		});

		if (checked) {
			const timeoutId = setTimeout(() => {
				deleteTodo(todoId);
				deletionTimeoutsRef.current.delete(todoId);
				setCheckedTodos(prev => {
					const next = new Set(prev);
					next.delete(todoId);
					return next;
				});
			}, DELETE_DELAY);

			deletionTimeoutsRef.current.set(todoId, timeoutId);
		}
	}, [deleteTodo]);

	useEffect(() => {
		return () => {
			deletionTimeoutsRef.current.forEach(clearTimeout);
			deletionTimeoutsRef.current.clear();
		};
	}, []);

	return {
		checkedTodos,
		handleTodoToggle,
	};
}
