"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import success from "@/lottiefiles/success.json";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import Lottie from "@/components/common/lottie";
import { Button } from "@/components/common/button";

export const ReviewSuccess: FC<{ closeModal: () => void }> = ({ closeModal }) => {
	const router = useRouter();

	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						action: () => {
							closeModal();
						},
					},
					{
						label: "Create Job",
						active: true,
						link: "/jobs/create",
					},
				]}
				className="!fixed top-[70px] !bg-[#0E1319]"
			/>
			<div className="fixed top-[70px+43px] mt-[43px] flex h-max flex-col items-center justify-between gap-4 p-4">
				<div className="">
					<Image src="/images/pakt-build-dark.png" width={200} height={57} alt="logo" />
				</div>
				<div className="max-w-[200px]">
					<Lottie animationData={success} loop={false} />
				</div>
				<div className="flex flex-col items-center gap-9 text-center">
					<div className="flex flex-col items-center gap-9 text-center">
						<p className="max-w-[80%] text-base text-title">
							Your review has been submitted and payment has been released.
						</p>
						<div className="w-full max-w-[200px]">
							<Button
								fullWidth
								size="lg"
								onClick={(e) => {
									e.stopPropagation();
									closeModal();
									router.push("/wallet");
								}}
								variant="primary"
							>
								Go To Wallet
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
