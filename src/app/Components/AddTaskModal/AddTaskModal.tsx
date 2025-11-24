"use client";

import styles from "./AddTaskModal.module.scss";

import { Button } from "@atoms/Button/Button";
import { Icon } from "@atoms/Icons/Icon";
import { InputField } from "@atoms/InputField/InputField";
import { Message } from "@atoms/Message/Message";
import { Text } from "@atoms/Text/Text";
import * as Dialog from "@radix-ui/react-dialog";
import { useActionState, useEffect, useRef } from "react";
import { FormState, saveGeneralTodo } from "../../actions/generalTodos";

type AddTaskModalProps = {
	open: boolean;
	onOpenAction: (open: boolean) => void;
	defaultValue?: string;
	renderTrigger?: boolean;
	editMode?: {
		todoId: string;
		initialText: string;
	};
};

const initialState: FormState = {
	error: undefined,
};

export function AddTaskModal(props: AddTaskModalProps) {
	const { open, onOpenAction, defaultValue, renderTrigger = true, editMode } = props;
	const isEditMode = !!editMode;
	const [state, formAction, isPending] = useActionState(saveGeneralTodo, initialState);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (state.success && !isPending) {
			onOpenAction(false);
			formRef.current?.reset();
		}
	}, [state.success, isPending, onOpenAction]);

	const formKey = isEditMode ? editMode.todoId : "create";

	return (
		<Dialog.Root open={open} onOpenChange={onOpenAction}>
			{renderTrigger && (
				<Dialog.Trigger asChild>
					<button className={styles["add-task-button"]}>
						<Icon name="plus" />
					</button>
				</Dialog.Trigger>
			)}
			<Dialog.Portal>
				<Dialog.Overlay className={styles["overlay"]} />
				<Dialog.Content className={styles["content"]}>
					<Dialog.Title className={styles["title"]}>
						<Text>{isEditMode ? "Edit Task" : "Add New Task"}</Text>
					</Dialog.Title>
					<form action={formAction} ref={formRef} key={formKey}>
						{isEditMode && <input type="hidden" name="todoId" value={editMode.todoId} />}
						<fieldset className={styles["fieldset"]}>
							<InputField
								name="text"
								defaultValue={isEditMode ? editMode.initialText : defaultValue}
								required
							/>
						</fieldset>
						{state.error && <Message variant="error">{state.error}</Message>}
						<div className={styles["button-group"]}>
							<Button type="submit" variant="primary" fontWeight={700} disabled={isPending}>
								{isPending ? "Saving..." : "Save Task"}
							</Button>

							<Dialog.Close asChild>
								<Button variant="secondary" aria-label="Close" fontWeight={700}>
									Close
								</Button>
							</Dialog.Close>
						</div>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
