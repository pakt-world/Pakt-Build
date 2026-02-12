"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Check } from "lucide-react";
import { type ReactElement } from "react";

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
		<label className="flex w-full cursor-pointer items-center gap-4 border-none">
			<Check
				className={cn(
					"input-style flex cursor-pointer items-center gap-4 rounded-lg border-none text-body opacity-50 ",
					{
						" bg-opacity-10 text-primary opacity-100 duration-200": isComplete,
					}
				)}
			/>
			<span
				className={cn(
					"input-style flex cursor-pointer items-center gap-4 rounded-lg border-none text-body opacity-50 duration-200",
					{
						"text-primary opacity-100 duration-200": isComplete,
					}
				)}
			>
				{children}
			</span>
		</label>
	);
};
