"use client";

import styles from "@components/Homepage/HomePage.module.scss";

import type { Block } from "@blocknote/core";
import { DesktopContent } from "@components/DesktopContent/DesktopContent";
import { DesktopNavigation } from "@components/DesktopNavigation/DesktopNavigation";
import { MobileNavigation } from "@components/MobileNavigation/MobileNavigation";
import { ProfileContent } from "@components/ProfileContent/ProfileContent";
import { RememberContent } from "@components/RememberContent/RememberContent";
import { Sidebar } from "@components/SideBar/Sidebar";
import { WeeklyContent } from "@components/WeeklyContent/WeeklyContent";
import { useDailyNotesCache } from "@hooks/useDailyNotesCache";
import { useGeneralTodos } from "@hooks/useGeneralTodos";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { getCurrentWeek } from "@utils/getCurrentWeek";
import { useEffect, useState } from "react";
import { getWeeklyNotes } from "../../actions/dailyNotes";

export default function HomePage() {
	const isMobile = useMediaQuery("(max-width: 1023px)");
	const [selectedContent, setSelectedContent] = useState<"weekly" | "remember" | "profile">("weekly");
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [baseDate, setBaseDate] = useState<Date>(new Date());
	const { rangeLabel } = getCurrentWeek(baseDate);

	const todosState = useGeneralTodos();
	const notesCache = useDailyNotesCache();
	const [weekLoaded, setWeekLoaded] = useState(false);

	useEffect(() => {
		const { days } = getCurrentWeek(baseDate);
		const startDate = days[0].fullDate;
		const endDate = days[6].fullDate;

		setWeekLoaded(false);

		const loadWeeklyNotes = async () => {
			const notes = await getWeeklyNotes(startDate, endDate);

			notes.forEach((note) => {
				const dateString = note.date.toISOString().split("T")[0];
				notesCache.setCache(dateString, note.content as Block[] | undefined);
			});

			// Also pre-populate empty dates in the week
			days.forEach((day) => {
				const dateString = day.fullDate.toISOString().split("T")[0];
				if (!notesCache.hasCache(dateString)) {
					notesCache.setCache(dateString, undefined);
				}
			});

			setWeekLoaded(true);
		};

		loadWeeklyNotes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [baseDate]);

	const renderMobileContent = () => {
		if (!weekLoaded) return null;

		switch (selectedContent) {
			case "weekly":
				return <WeeklyContent selectedDate={selectedDate} notesCache={notesCache} />;
			case "remember":
				return <RememberContent todosState={todosState} />;
			case "profile":
				return <ProfileContent />;
			default:
				return null;
		}
	};

	return (
		<div className={styles["home-page"]}>
			{isMobile
				? (
					<div className={styles["mobile-view"]}>
						<MobileNavigation
							content={selectedContent}
							onChangeAction={setSelectedContent}
							selectedDate={selectedDate}
							onSelectDateAction={setSelectedDate}
							baseDate={baseDate}
							setBaseDateAction={setBaseDate}
						/>
						{renderMobileContent()}
					</div>
				)
				: (
					<div className={styles["desktop-view"]}>
						<DesktopNavigation rangeLabel={rangeLabel} />
						<div className={styles["sidebar-content-section"]}>
							<Sidebar
								baseDate={baseDate}
								setBaseDateAction={setBaseDate}
								rangeLabel={rangeLabel}
								todosState={todosState}
							/>
							{weekLoaded && <DesktopContent baseDate={baseDate} notesCache={notesCache} />}
						</div>
					</div>
				)}
		</div>
	);
}
