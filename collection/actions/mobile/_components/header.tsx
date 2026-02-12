"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef, useState, type FC } from "react";
import { format } from "date-fns";
import { useOnClickOutside } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { TalentProfile } from "@/components/common/talent-profile-image";
import { CollectionStatus } from "@/lib/enums";
import { TalentProps } from "@/lib/types/talents";
import { JobAmountBadge } from "@/collection/_shared/collection-amount-badge";
import { CoinProps } from "@/lib/types/collection";

interface Props {
	status?: CollectionStatus;
	createdAt: string;
	deliveryDate: string;
	paymentFee: number;
	profile: TalentProps;
	tags: Array<{
		color: string;
		name: string;
	}>;
	requestJobCancellation?: () => void;
	meta: {
		coin: CoinProps;
		usdInitialValue: number;
	};
	realTimeRate: number;
	isFunded: boolean;
	paymentRate: string;
}

export const JobUpdateHeader4Mobile: FC<Props> = ({
	createdAt: _cA,
	profile,
	deliveryDate,
	paymentFee,
	tags,
	status = CollectionStatus.ONGOING,
	requestJobCancellation,
	meta,
	realTimeRate,
	isFunded,
	paymentRate,
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const ref = useRef<HTMLDivElement | null>(null);

	const handleClickOutside = (): void => {
		setIsPopoverOpen(false);
	};

	useOnClickOutside(ref, handleClickOutside);

	useEffect(() => {
		const handleScroll = () => {
			setIsPopoverOpen(false);
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="flex flex-col">
			<div
				className="flex items-center divide-x border-b p-4"
				style={{
					borderColor: status === "cancel_requested" ? "#FFBDBD" : "#9BDCFD",
					backgroundColor: status === "cancel_requested" ? "#FFF8F8" : "#F4F8FF",
				}}
			>
				{/* <div className="flex flex-col gap-2">
					<span className="text-sm text-body">Date Created</span>
					<span className="text-xs text-black">{format(new Date(createdAt), "d MMM, yyyy")}</span>
				</div> */}
				<div className="flex flex-col gap-2 pr-2">
					<span className="text-xs text-body">Due Date</span>
					<span className="text-sm text-black">{format(new Date(deliveryDate), "d MMM, yyyy")}</span>
				</div>

				<div className="flex flex-1 flex-col gap-2 px-2">
					<span className="text-xs text-body">Price</span>
					<JobAmountBadge
						paymentFee={paymentFee}
						coin={meta?.coin}
						realTimeRate={realTimeRate}
						className="!h-max bg-transparent !p-0 !text-sm"
						isFunded={isFunded}
						usdInitialValue={meta?.usdInitialValue}
						paymentRate={paymentRate}
					/>
				</div>
				<div className="flex flex-col gap-2 pl-2">
					<span className="text-xs text-body">Status</span>

					<p
						className="flex w-max items-center justify-center rounded-full p-1 text-center text-[10.50px] leading-none tracking-wide text-white"
						style={{
							borderColor: status === "cancel_requested" ? "#FFBDBD" : "#7DDE86",
							backgroundColor: status === "cancel_requested" ? "#EE4B2B" : "#7DDE86",
						}}
					>
						{status === "cancel_requested" ? "Cancelling" : "In Progress"}
					</p>
				</div>
			</div>

			<div
				className="flex flex-col divide-y border-b p-4"
				style={{
					borderColor: status === "cancel_requested" ? "#FFBDBD" : "#9BDCFD",
					backgroundColor: status === "cancel_requested" ? "#FFF8F8" : "#F4F8FF",
				}}
			>
				<div className="flex items-start justify-between gap-2 pb-1">
					<div className="flex items-center gap-2">
						<TalentProfile
							score={profile?.score || 0}
							size="sm"
							src={profile?.profileImage?.url}
							url={`/talents/${profile?._id}`}
						/>
						<div className="flex flex-col">
							<span className="text-lg font-bold text-title">{`${profile?.firstName}`}</span>
							<span className="text-sm capitalize">{profile?.profile?.bio?.title}</span>
						</div>
					</div>
					{status !== CollectionStatus.CANCEL_REQUESTED && (
						<div className="relative" ref={ref}>
							<button
								type="button"
								aria-label="More"
								onClick={() => {
									setIsPopoverOpen(!isPopoverOpen);
								}}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M4.95476 0.193352C4.75177 0.0935904 4.51758 0.0781034 4.30322 0.150266C4.08887 0.222429 3.91172 0.376391 3.81039 0.578601C3.70906 0.78081 3.69176 1.01487 3.76226 1.22978C3.83276 1.44469 3.98534 1.62303 4.18676 1.72592L4.57076 1.91792V15.2894L4.18676 15.4814C3.9833 15.583 3.82854 15.7612 3.75653 15.977C3.68451 16.1927 3.70114 16.4282 3.80276 16.6316C3.90438 16.8351 4.08265 16.9899 4.29837 17.0619C4.51409 17.1339 4.74959 17.1173 4.95305 17.0156L20.2428 9.36992C20.3849 9.29866 20.5045 9.18925 20.588 9.05392C20.6716 8.91859 20.7158 8.76268 20.7158 8.60364C20.7158 8.44459 20.6716 8.28869 20.588 8.15336C20.5045 8.01803 20.3849 7.90861 20.2428 7.83735L4.95305 0.189923L4.95476 0.193352Z"
										fill="#FA8F91"
									/>
									<path
										fill-rule="evenodd"
										clip-rule="evenodd"
										d="M4.57038 0.0761719C4.73922 0.0761719 4.90641 0.109428 5.0624 0.174041C5.21839 0.238654 5.36013 0.333359 5.47952 0.452749C5.59891 0.572138 5.69361 0.713875 5.75823 0.869865C5.82284 1.02585 5.8561 1.19304 5.8561 1.36189V22.6396C5.8561 22.9806 5.72064 23.3076 5.47952 23.5487C5.2384 23.7899 4.91137 23.9253 4.57038 23.9253C4.22939 23.9253 3.90236 23.7899 3.66124 23.5487C3.42013 23.3076 3.28467 22.9806 3.28467 22.6396V1.36189C3.28467 1.02089 3.42013 0.693867 3.66124 0.452749C3.90236 0.211631 4.22939 0.0761719 4.57038 0.0761719Z"
										fill="#C5282B"
									/>
								</svg>
							</button>
							{isPopoverOpen && (
								<div className="absolute right-0 top-8 flex w-max flex-col rounded-md border-red-100 bg-[#FFFFFF] p-0 text-red-500">
									<button
										className="px-4 py-2 text-left duration-200 hover:bg-red-100"
										onClick={requestJobCancellation}
										type="button"
									>
										Cancel Job
									</button>
									{/* <button
								type="button"
								className="px-4 py-2 text-left duration-200 hover:bg-red-100"
								onClick={reportAnIssue}
							>
								Report an Issue
							</button> */}
								</div>
							)}
						</div>
					)}
				</div>
				<div className="flex items-center gap-2 pt-4">
					<span className="text-body">Skills:</span>
					<div className="flex items-center gap-2 text-sm">
						{tags.map(({ color, name }) => {
							return (
								<span
									key={name}
									className="rounded-full px-4 py-0.5 capitalize"
									style={{
										backgroundColor: color,
									}}
								>
									{name}
								</span>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
