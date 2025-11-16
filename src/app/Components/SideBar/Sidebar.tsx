"use client";

import profilePlaceholder from "@assets/images/profile-image-placeholder.jpg";
import Checkbox from "@atoms/Checkbox/Checkbox";
import { Icon } from "@atoms/Icons/Icon";
import { Spinner } from "@atoms/Spinner/Spinner";
import { Text } from "@atoms/Text/Text";
import { AddTaskModal } from "@components/AddTaskModal/AddTaskModal";
import WeeklySlider from "@components/WeeklySlider/WeeklySlider";
import { useGeneralTodos } from "@hooks/useGeneralTodos";
import { useTodoToggle } from "@hooks/useTodoToggle";
import { createClient } from "@utils/supabase/client";
import { isCurrentWeek } from "@utils/usCurrentWeek";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";

type SidebarProps = {
	baseDate: Date;
	setBaseDate: (date: Date) => void;
	rangeLabel: string;
};

export function Sidebar({ baseDate, setBaseDate, rangeLabel }: SidebarProps) {
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [userEmail, setUserEmail] = useState<string>("");
	const [displayName, setDisplayName] = useState<string>("");
	const router = useRouter();
	const supabase = createClient();
	const { todos, loading, deleteTodo, refresh } = useGeneralTodos();
	const { checkedTodos, handleTodoToggle } = useTodoToggle(deleteTodo);

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	useEffect(() => {
		if (!isAddOpen) refresh();
	}, [isAddOpen, refresh]);

	useEffect(() => {
		const fetchUserData = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (user) {
				setUserEmail(user.email || "");

				const { data: profile, error } = await supabase
					.from("profile")
					.select("displayName")
					.eq("id", user.id)
					.single();

				if (error) {
					console.error("Error fetching profile:", error);
				} else if (profile?.displayName) {
					setDisplayName(profile.displayName);
				}
			}
		};

		fetchUserData();
	}, [supabase]);

	return (
		<div className={styles["sidebar"]}>
			<div className={styles["profile-section"]}>
				<button type="button" aria-label="Open profile" className={styles["profile-button"]}>
					<Image alt="profile image" src={profilePlaceholder} className={styles["profile-image"]} />
				</button>
				<div className={styles["profile-info"]}>
					<Text className={styles["username"]}>{displayName || "User"}</Text>
					<Text size="sm" className={styles["email"]}>{userEmail}</Text>
				</div>
			</div>
			<div className={styles["sticky-section"]}>
				<div className={styles["week-slider-section"]}>
					<WeeklySlider baseDate={baseDate} rangeLabel={rangeLabel} setBaseDate={setBaseDate} />
					{isCurrentWeek(baseDate) && (
						<div className={styles["current-week-indicator"]}>
							<Text>Current Week</Text>
						</div>
					)}
				</div>
				<div className={styles["remember-section"]}>
					<div className={styles["remember-header-row"]}>
						<Text size="xl" className={styles["remember-header"]}>
							General Todos
						</Text>
						<button
							type="button"
							className={styles["add-header-button"]}
							onClick={() => setIsAddOpen(true)}
							aria-label="Add new todo"
							aria-haspopup="dialog"
							aria-expanded={isAddOpen}
						>
							<Icon name="plus" />
						</button>
					</div>
					<div className={styles["remember-items"]}>
						{loading
							? <Spinner size="lg" className={styles["remember-loading"]} />
							: todos.length === 0
							? <Text size="sm">No todos yet. Click + to add one!</Text>
							: (
								todos.map(todo => (
									<Checkbox
										key={todo.id}
										label={todo.text}
										checked={checkedTodos.has(todo.id)}
										onChange={checked => handleTodoToggle(todo.id, checked)}
									/>
								))
							)}
					</div>
				</div>
			</div>
			<div className={styles["settings-section"]}>
				<button type="button" className={styles["settings-item"]}>
					<Icon name="settings" />
					<Text className={styles["settings-label"]}>Settings</Text>
				</button>
				<button type="button" className={styles["settings-item"]}>
					<Icon name="questionmark" />
					<Text className={styles["settings-label"]}>Help & Support</Text>
				</button>
				<button type="button" className={styles["settings-item"]} onClick={handleSignOut}>
					<Icon name="sign-out" />
					<Text className={styles["settings-label"]}>Sign Out</Text>
				</button>
			</div>
			<AddTaskModal open={isAddOpen} setOpen={setIsAddOpen} renderTrigger={false} />
		</div>
	);
}
