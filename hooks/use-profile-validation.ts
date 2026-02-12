"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import type * as z from "zod";
import { UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { editProfileFormSchema } from "@/lib/validations";

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

interface ProfileValidationProps {
	profileDetailsForm: UseFormReturn<EditProfileFormValues>;
	professionalInformationForm: UseFormReturn<EditProfileFormValues>;
}

export const useProfileValidation = ({ profileDetailsForm, professionalInformationForm }: ProfileValidationProps) => {
	const [profileCompleted, setProfileCompleted] = useState(false);
	const [profileSteps, setProfileSteps] = useState({
		name: false,
		role: false,
		location: false,
		skills: false,
		bio: false,
	});

	const firstName = profileDetailsForm.watch("firstName");
	const title = profileDetailsForm.watch("title");
	const location = profileDetailsForm.watch("location");
	const tags = professionalInformationForm.watch("tags");
	const bio = professionalInformationForm.watch("bio");

	useEffect(() => {
		const nameValid =
			profileDetailsForm.watch("firstName") !== "" && !profileDetailsForm.getFieldState("firstName").invalid;
		const roleValid =
			profileDetailsForm.watch("title") !== "" && !profileDetailsForm.getFieldState("title").invalid;
		const locationValid =
			profileDetailsForm.watch("location") !== "" && !profileDetailsForm.getFieldState("location").invalid;
		const skillsValid =
			Array.isArray(professionalInformationForm.watch("tags")) &&
			professionalInformationForm.watch("tags").filter((r: string | undefined) => r !== undefined && r !== "")
				.length >= 3 &&
			!professionalInformationForm.getFieldState("tags").invalid;
		const bioValid =
			professionalInformationForm.watch("bio") !== "" &&
			!professionalInformationForm.getFieldState("bio").invalid;

		// Update profileSteps state
		setProfileSteps({
			name: nameValid,
			role: roleValid,
			location: locationValid,
			skills: skillsValid,
			bio: bioValid,
		});

		// Check through all the fields to see if they are valid
		setProfileCompleted(nameValid && roleValid && locationValid && skillsValid && bioValid);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firstName, title, location, tags, bio]);

	return { profileCompleted, profileSteps };
};
