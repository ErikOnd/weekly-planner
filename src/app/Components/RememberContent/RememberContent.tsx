import styles from "./RememberContent.module.scss";

import { Spinner } from "@atoms/Spinner/Spinner";
import { Text } from "@atoms/Text/Text";
import { AddTaskModal } from "@components/AddTaskModal/AddTaskModal";
import { TaskItem } from "@components/TaskItem/TaskItem";
import { useGeneralTodos } from "@hooks/useGeneralTodos";
import { useTodoToggle } from "@hooks/useTodoToggle";
import { useEffect, useState } from "react";

type RememberContentProps = {
	rememberItems?: string[];
};

export function RememberContent(props: RememberContentProps) {
	const {} = props;

	const [modalOpen, setModalOpen] = useState(false);
	const { todos, loading, deleteTodo, refresh } = useGeneralTodos();
	const { checkedTodos, handleTodoToggle } = useTodoToggle(deleteTodo);

	useEffect(() => {
		if (!modalOpen) refresh();
	}, [modalOpen, refresh]);

	return (
		<div className={styles["remember-content"]}>
			<div className={styles["task-items"]}>
				{loading
					? <Spinner size="lg" className={styles["remember-loading"]} />
					: todos.length === 0
					? <Text size="sm">No todos yet. Click + to add one!</Text>
					: (
						todos.map(todo => (
							<TaskItem
								key={todo.id}
								taskName={todo.text}
								checked={checkedTodos.has(todo.id)}
								onChange={checked => handleTodoToggle(todo.id, checked)}
							/>
						))
					)}
			</div>
			<AddTaskModal open={modalOpen} onOpenAction={setModalOpen} />
		</div>
	);
}
