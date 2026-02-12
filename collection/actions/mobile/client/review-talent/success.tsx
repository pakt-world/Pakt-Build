"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import success from "@/lottiefiles/success.json";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import Lottie from "@/components/common/lottie";

export const ReviewSuccess = ({ closeModal }: { closeModal: () => void }): JSX.Element => {
	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?skills=&search=&range=%2C100&jobs-type=created",
					},
					{
						label: "Create Job",
						active: true,
						link: "/jobs/create",
					},
				]}
				className="!fixed top-[70px] !bg-[#0E1319]"
			/>
			<div className="fixed top-[70px+43px] mt-[43px] flex flex-col items-center justify-between gap-4 p-4">
				<div className="">
					<Image src="/images/pakt-build-dark.png" width={200} height={57} alt="logo" />
				</div>
				<div className="max-w-[200px]">
					<Lottie animationData={success} loop={false} />
				</div>
				<div className="flex flex-col items-center gap-9 text-center">
					<div className="flex flex-col items-center gap-9 text-center">
						<p className="max-w-[80%] text-base text-title">
							Your review has been submitted. Payment will be released after talent has submitted their
							review.
						</p>

						<Button
							fullWidth
							size="lg"
							onClick={(e) => {
								e.stopPropagation();
								closeModal();
							}}
							variant="primary"
							className="w-full max-w-[200px] cursor-pointer"
						>
							Go to Dashboard
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
