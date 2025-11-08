"use client";


import { useId, useState } from "react";
import { Button } from "@atoms/Button/Button";
import { Text } from "@atoms/Text/Text";
import {InputField} from "@atoms/InputField/InputField";


export type PasswordFieldProps = {
	label?: string;
	value: string;
	onChange: (val: string) => void;
	placeholder?: string;
	disabled?: boolean;
	name?: string;
	autoComplete?: string;
};


export function PasswordField({
	                              label = "Password",
	                              value,
	                              onChange,
	                              placeholder = "Your password",
	                              disabled,
	                              name = "password",
	                              autoComplete = "current-password",
                              }: PasswordFieldProps) {
	const id = useId();
	const [show, setShow] = useState(false);


	return (
		<div>
			<label htmlFor={id}>
				<Text as="span" size="sm" fontWeight={600}>{label}</Text>
			</label>
			<div style={{ display: "flex", gap: 8, alignItems: "center" }}>
				<InputField
					id={id}
					name={name}
					type={show ? "text" : "password"}
					value={value}
					placeholder={placeholder}
					autoComplete={autoComplete}
					required
					disabled={disabled}
					onChange={(e) => onChange(e.target.value)}
				/>
				<Button
					type="button"
					variant="secondary"
					onClick={() => setShow((s) => !s)}
					disabled={disabled}
					aria-pressed={show}
					aria-label={show ? "Hide password" : "Show password"}
					style={{ marginTop: 6 }}
				>
					{show ? "Hide" : "Show"}
				</Button>
			</div>
		</div>
	);
}