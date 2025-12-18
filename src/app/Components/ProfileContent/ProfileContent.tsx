"use client";

import { ProfileSettingsContent } from "@components/ProfileSettingsContent/ProfileSettingsContent";
import { useProfileSettings } from "@hooks/useProfileSettings";
import { createClient } from "@utils/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./ProfileContent.module.scss";

export function ProfileContent() {
	const profileSettings = useProfileSettings();
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/login");
	};

	return (
		<div className={styles["profile-container"]}>
			<ProfileSettingsContent {...profileSettings} handleLogout={handleLogout} styles={styles} />
		</div>
	);
}
