import styles from "./LoginPage.module.scss"

import {AuthForm} from "@components/auth/AuthForm";

export default function LoginPage() {
	return (
		<main className={styles["login-holder"]}>
			<AuthForm />
		</main>
	);
}