"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { Checkbox } from "pakt-ui";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
	isComplete?: boolean;
	children: React.ReactNode;
}

export const StepIndicator = ({ children, isComplete }: StepIndicatorProps): ReactElement | null => {
	return (
		<label
			className={cn(
				`flex cursor-pointer items-center gap-4 rounded-lg border border-gray-300 border-opacity-50 bg-gray-50 px-3 py-3
				duration-200 hover:bg-primary hover:bg-opacity-10`,
				{
					"border-primary border-opacity-40 bg-green-300 bg-opacity-10 duration-200 hover:bg-opacity-20":
						isComplete,
				}
			)}
		>
			<Checkbox checked={isComplete} />
			<span>{children}</span>
		</label>
	);
};

interface StepsProps {
	jobSteps: {
		details: boolean;
		skills: boolean;
		description: boolean;
		deliverables: boolean;
		classification: boolean;
	};
	isEdit?: boolean;
}

const Steps = ({ jobSteps, isEdit }: StepsProps): ReactElement => {
	return (
		<div className="hidden h-fit flex-col gap-3 rounded-xl border border-line bg-white p-6 shadow sm:flex">
			<h3 className="font-bold">Steps</h3>
			<StepIndicator isComplete={jobSteps.details}>Job Details</StepIndicator>
			<StepIndicator isComplete={jobSteps.skills}>Skills</StepIndicator>
			<StepIndicator isComplete={jobSteps.description}>Description</StepIndicator>
			<StepIndicator isComplete={jobSteps.deliverables}>Deliverables</StepIndicator>
			<StepIndicator isComplete={jobSteps.classification}>Classifications</StepIndicator>
			{isEdit && <StepIndicator isComplete={false}>Deposit Payment</StepIndicator>}
		</div>
	);
};

export default Steps;
