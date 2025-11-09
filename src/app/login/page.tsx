import styles from "./LoginPage.module.scss";

import { AuthForm } from "@components/auth/AuthForm";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage() {
	const supabase = await createClient();

	const { data, error } = await supabase.auth.getUser();

	if (!error && data?.user) {
		redirect("/");
	}

	return (
		<main className={styles["login-holder"]}>
			<AuthForm />
		</main>
	);
}
