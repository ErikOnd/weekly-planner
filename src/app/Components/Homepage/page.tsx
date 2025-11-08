"use client";
import styles from "@components/Homepage/HomePage.module.scss";

import { DesktopContent } from "@components/DesktopContent/DesktopContent";
import { DesktopNavigation } from "@components/DesktopNavigation/DesktopNavigation";
import { MobileNavigation } from "@components/MobileNavigation/MobileNavigation";
import { ProfileContent } from "@components/ProfileContent/ProfileContent";
import { RememberContent } from "@components/RememberContent/RememberContent";
import { Sidebar } from "@components/SideBar/Sidebar";
import { WeeklyContent } from "@components/WeeklyContent/WeeklyContent";
import { useMediaQuery } from "@hooks/useMediaQuery";
import { getCurrentWeek } from "@utils/getCurrentWeek";
import { useState } from "react";

export default function HomePage() {
	const isMobile = useMediaQuery("(max-width: 1023px)");
	const [selectedContent, setSelectedContent] = useState<"weekly" | "remember" | "profile">("weekly");
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [baseDate, setBaseDate] = useState<Date>(new Date());
	const { rangeLabel } = getCurrentWeek(baseDate);

	const renderMobileContent = () => {
		switch (selectedContent) {
			case "weekly":
				return <WeeklyContent selectedDate={selectedDate} />;
			case "remember":
				return <RememberContent />;
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
							onChange={setSelectedContent}
							selectedDate={selectedDate}
							onSelectDate={setSelectedDate}
							baseDate={baseDate}
							setBaseDate={setBaseDate}
						/>
						{renderMobileContent()}
					</div>
				)
				: (
					<div className={styles["desktop-view"]}>
						<DesktopNavigation rangeLabel={rangeLabel} />
						<div className={styles["sidebar-content-section"]}>
							<Sidebar baseDate={baseDate} setBaseDate={setBaseDate} rangeLabel={rangeLabel} />
							<DesktopContent baseDate={baseDate} />
						</div>
					</div>
				)}
		</div>
	);
}
