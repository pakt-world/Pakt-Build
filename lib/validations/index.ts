"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import * as z from "zod";
import { rejectSpecialCharacters } from "../utils";

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.")
	.regex(/[0-9]/, "Password must contain at least one number.")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter.")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
	.regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character.");

export const otpSchema = z.object({
	otp: z.string().min(6, { message: "OTP is required" }),
});

export const forgotPasswordSchema = z.object({
	email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});

export const loginSchema = z.object({
	password: z.string().min(1, "Password is required").min(8, "Password is too short"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
});

export const signupSchema = z
	.object({
		// lastName: z.string().optional(),
		firstName: z.string().min(1, { message: "Name is required" }),
		email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address."),
		password: passwordSchema,
		confirmPassword: z.string().min(1, { message: "Confirm password is required" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match.",
	});

export const referralSchema = z.object({
	emails: z.array(z.string()).nonempty({ message: "emails are required" }),
});

export const editProfileFormSchema = z.object({
	firstName: z.string().min(1, "First Name is required"),
	// lastName: z.string().optional(),
	title: z.string().min(1, "Job Title is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	bio: z.string().min(1, "Bio is required"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	tags: z
		.array(
			z.string().refine((tag) => rejectSpecialCharacters(tag), {
				message: "Special characters are not allowed",
			})
		)
		.min(3, "Minimum of 3 skills are required")
		.max(10, "Maximum of 10 skills are required"),
	isPrivate: z.boolean().default(false).optional(),
	website: z.string().optional(),
	x: z.string().optional(),
	tiktok: z.string().optional(),
	instagram: z.string().optional(),
	github: z.string().optional(),
});

// Mobile

export const editProfileFormSchema4Mobile = z.object({
	firstName: z.string().min(1, "First Name is required"),
	title: z.string().min(1, "Role is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
});

export const editProfileFormSchema4Mobile2 = z.object({
	firstName: z.string().min(1, "First Name is required"),
	title: z.string().min(1, "Role is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	isPrivate: z.boolean().default(false).optional(),
	bio: z
		.string()
		.trim()
		.min(10, "Bio must be at least 10 characters long")
		.max(350, "Bio must be at most 350 characters long")
		.regex(/^[a-zA-Z0-9\s.,!?'-]+$/, "Bio contains invalid characters"),
	tags: z.array(z.string()).min(3, "Minimum of 3 skills").max(10, "Maximum of 10 skills are required").optional(),
});

export const editProfileFormSchema4Mobile3 = z.object({
	firstName: z.string().min(1, "First Name is required"),
	title: z.string().min(1, "Role is required"),
	email: z.string().min(1, "Email is required").email("Invalid email"),
	location: z.string().min(1, "Location is required"),
	country: z.string().min(1, "Country is required"),
	isPrivate: z.boolean().default(false).optional(),
	bio: z
		.string()
		.trim()
		.min(10, "Bio must be at least 10 characters long")
		.max(350, "Bio must be at most 350 characters long")
		.regex(/^[a-zA-Z0-9\s.,!?'-]+$/, "Bio contains invalid characters"),
	tags: z.array(z.string()).min(3, "Minimum of 3 skills").max(10, "Maximum of 10 skills are required").optional(),
	website: z.string().optional(),
	x: z.string().optional(),
	tiktok: z.string().optional(),
	instagram: z.string().optional(),
	github: z.string().optional(),
});

export const changePasswordFormSchema = z
	.object({
		currentPassword: z.string().min(1, "Current Password is required"),
		newPassword: z
			.string()
			.min(1, "New Password is required")
			.regex(
				// eslint-disable-next-line no-useless-escape
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
				"Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
			),
		confirmNewPassword: z.string().min(1, "Confirm New Password is required"),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Passwords don't match",
		path: ["confirmNewPassword"],
	});

export const baseWithdrawFormSchema = z.object({
	coin: z.string().min(1, "Coin is required"),
	address: z.string().min(1, "Address is required"),
	amount: z
		.number()
		.positive("Amount must be a positive number")
		.refine((val) => val > 0, {
			message: "Amount must be a positive number",
		}),
	password: z.string().min(1, "Password is required"),
	confirm: z.boolean().refine((val) => val, {
		message: "You must confirm the above details before making your withdrawal.",
	}),
});

export const withdrawFormSchema = (balance: number) =>
	baseWithdrawFormSchema.extend({
		amount: baseWithdrawFormSchema.shape.amount.refine((val) => val <= balance, {
			message: `Amount cannot exceed available balance of ${balance}`,
		}),
	});

const skillSchema = (name: string) =>
	z
		.string()
		.min(1, `${name} Skill is required`)
		.refine((data) => rejectSpecialCharacters(data), {
			message: "Special characters are not allowed",
		});

export const baseCreateJobSchema = z.object({
	firstSkill: skillSchema("First"),
	secondSkill: skillSchema("Second"),
	thirdSkill: skillSchema("Third"),
	due: z.date({
		required_error: "Due date is required",
	}),
	visibility: z.object({
		label: z.string(),
		value: z.string(),
	}),
	budget: z.coerce.number().min(10, { message: "Budget must be at least $10" }),
	title: z
		.string()
		.nonempty({ message: "Job title is required" })
		.refine((data) => rejectSpecialCharacters(data, { allowApostrophes: true }), {
			message: "Special characters are not allowed",
		}),
	description: z.string().nonempty({ message: "Job description is required" }),
	category: z.object({
		label: z.string(),
		value: z.string(),
	}),
	deliverables: z
		.array(z.string().nonempty("Deliverable cannot be an empty string"), {
			required_error: "At least, one deliverable is required",
		})
		.max(5, {
			message: "You can add up to 5 deliverables",
		}),
	coin: z.object({
		active: z.boolean(),
		createdAt: z.string(),
		decimal: z.string(),
		icon: z.string(),
		isToken: z.boolean(),
		name: z.string(),
		reference: z.string(),
		rpcChainId: z.string(),
		symbol: z.string(),
		updatedAt: z.string(),
		__v: z.number(),
		_id: z.string(),
		contractAddress: z.string().optional(),
		// priceTag?: z.string(),
	}),
});

export const deleteAccountSchema = z.object({
	confirm: z.boolean().refine((val) => val, {
		message: "You must accept Terms and Conditions",
	}),
	password: z.string().min(1, { message: "Password is required" }),
	irreversible: z.boolean().refine((val) => val, {
		message: "You must confirm that you understand that this action is irreversible",
	}),
});
