import styles from "./TaskItem.module.scss";

import Checkbox from "@atoms/Checkbox/Checkbox";

type TaskItemProps = {
	taskName: string;
};

export function TaskItem(props: TaskItemProps) {
	const { taskName } = props;
	return (
		<div className={styles["task-item"]}>
			<Checkbox label={taskName} />
		</div>
	);
}
