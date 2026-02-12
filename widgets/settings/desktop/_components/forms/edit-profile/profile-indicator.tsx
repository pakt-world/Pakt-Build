"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { StepIndicator } from "@/components/common/step-indicator";

interface StepsProps {
	profileSteps: {
		name: boolean;
		location: boolean;
		skills: boolean;
		bio: boolean;
	};
}

export const ProfileSteps = ({ profileSteps }: StepsProps): ReactElement => {
	return (
		<div className="flex h-fit flex-col gap-3 rounded-xl bg-white p-6">
			<h3 className="font-bold text-title">Steps</h3>
			<div
				className="flex w-full flex-col items-start gap-6 rounded-lg border border-line bg-[#F7F7F7] px-3 py-3 duration-200
					hover:bg-opacity-10"
			>
				<StepIndicator isComplete={profileSteps.name}>Name</StepIndicator>
				<StepIndicator isComplete={profileSteps.location}>Location</StepIndicator>
				<StepIndicator isComplete={profileSteps.skills}>Skills</StepIndicator>
				<StepIndicator isComplete={profileSteps.bio}>Bio</StepIndicator>
			</div>
		</div>
	);
};
