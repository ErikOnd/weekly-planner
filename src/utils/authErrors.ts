export type AuthContext = "sign_in" | "sign_up" | "reset";

export function mapAuthError(err: unknown, context: AuthContext): string {
	const raw = String((err as any)?.message || "").toLowerCase();

	if (!raw && context === "reset") return "We couldn't send the reset email. Please try again.";
	if (raw.includes("invalid login credentials")) return "Email or password is incorrect.";
	if (raw.includes("email not confirmed") || raw.includes("confirm your email")) {
		return "Please confirm your email before logging in.";
	}
	if (raw.includes("user already registered")) {
		return "An account with this email already exists. Try logging in instead.";
	}
	if (raw.includes("rate limit") || raw.includes("too many")) {
		return "Too many attempts. Please wait a minute and try again.";
	}
	if (raw.includes("password should be at least") || raw.includes("weak password")) {
		return "Your password is too weak. Please use at least 6 characters.";
	}

	return (err as any)?.message ?? "Something went wrong. Please try again.";
}
