"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useToggleDeliverableCompletion } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { formatDateHandler } from "@/lib/utils";

interface SquareCheckMarkProps {
	isChecked: boolean;
	onClick: () => void;
	isClient?: boolean;
	disabled?: boolean;
}

export const CheckButton = ({
	isChecked,
	onClick: setIsChecked,
	isClient,
	disabled,
}: SquareCheckMarkProps): JSX.Element => {
	return (
		<button
			className="size-[24px] scale-[0.8] appearance-none !bg-white disabled:cursor-not-allowed"
			onClick={setIsChecked}
			type="button"
			disabled={isClient ?? disabled}
		>
			{isChecked ? (
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<rect x="1" y="1" width="22" height="22" rx="5" fill="#008D6C" />
					<path
						d="M8 13L10.9167 16L16 8"
						stroke="#ffffff"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<rect x="1" y="1" width="22" height="22" rx="5" stroke="#4C80D4" strokeWidth="2" />
				</svg>
			) : (
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<rect
						x="1"
						y="1"
						width="22"
						height="22"
						rx="5"
						stroke="#4C80D4"
						fill="url(#paint0_linear_988_53583)"
					/>
					<rect x="1" y="1" width="22" height="22" rx="5" stroke="#4C80D4" strokeWidth="2" fill="white" />
					<defs>
						<linearGradient
							id="paint0_linear_988_53583"
							x1="12"
							y1="0"
							x2="12"
							y2="24"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#FCFCFC" />
							<stop offset="1" stopColor="#F8F8F8" />
						</linearGradient>
					</defs>
				</svg>
			)}
		</button>
	);
};

interface DeliverablesStepProps {
	jobId: string;
	jobCreator: string;
	progress: number; // 0 or 100
	updatedAt: string;
	description: string;
	deliverableId: string;
	isLast: boolean;
	isClient?: boolean;

	totalDeliverables: number;
	completedDeliverables: number;
	disableCheckboxes: boolean;
	setDisableCheckboxes: (value: boolean) => void;
}

export const DeliverableStep = ({
	jobId,
	jobCreator,
	isLast,
	isClient,
	updatedAt,
	progress,
	description,
	deliverableId,
	totalDeliverables,
	completedDeliverables,
	disableCheckboxes,
	setDisableCheckboxes,
}: DeliverablesStepProps): ReactElement => {
	const [checkBoxLoading, setCheckBoxLoading] = useState(false);
	const mutation = useToggleDeliverableCompletion({ description });
	const [isComplete, setIsComplete] = useState(progress === 100);

	useMemo(() => {
		setIsComplete(progress == 100);
	}, [progress]);

	return (
		<div className="relative flex w-full items-start gap-3 py-1">
			<div
				className={`absolute left-3 top-0 h-full w-[2px] translate-y-3 ${isComplete ? "bg-primary-gradient-light" : "bg-gray-300"}`}
				style={{
					display: isLast ? "none" : "block",
				}}
			/>
			{checkBoxLoading ? (
				<Spinner className="w-max text-body" />
			) : (
				<CheckButton
					isChecked={isComplete}
					isClient={isClient}
					onClick={() => {
						if (isClient) return;
						setCheckBoxLoading(true);
						setDisableCheckboxes(true);
						mutation.mutate(
							{
								jobId,
								deliverableId,
								totalDeliverables,
								completedDeliverables,
								isComplete: !isComplete,
								jobCreator,
								meta: {
									completedAt: !isComplete ? formatDateHandler() : "",
								},
							},
							{
								onSuccess: () => {
									setCheckBoxLoading(false);
									setDisableCheckboxes(false);
								},
								onError: () => {
									setCheckBoxLoading(false);
									mutation.reset();
									setIsComplete((prev) => !prev);
								},
							}
						);
						setIsComplete((prev) => !prev);
					}}
					disabled={disableCheckboxes}
				/>
			)}
			<div className="w-full rounded-lg border border-green-lighter p-2 text-body">
				<p
					style={{
						textDecoration: isComplete ? "line-through" : "none",
					}}
				>
					{description}
				</p>

				{isComplete && updatedAt && (
					<span className="text-xs text-[#23C16B]">
						Completed: {formatDateHandler(updatedAt, "DD MMM YYYY hh:mm A")}
					</span>
				)}
			</div>
		</div>
	);
};
