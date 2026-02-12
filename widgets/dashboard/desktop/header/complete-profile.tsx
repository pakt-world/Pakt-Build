"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { Search, Plus, Briefcase, UserCheck } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { KycVerificationStatus } from "@/lib/enums";
import { useUserState } from "@/lib/store/account";
import { userKycIsApproved } from "@/lib/utils";

export const DesktopCallToAction = (): JSX.Element | null => {
	const router = useRouter();

	const { user } = useUserState();
	const { firstName, kycStatus, profileCompleteness } = user ?? {};

	const profileCompleted = (profileCompleteness as number) > 70;

	const userHasDoneKyc = userKycIsApproved(kycStatus ?? KycVerificationStatus.EMPTY);

	if (!firstName) return null;

	if (!profileCompleted) {
		return (
			<div className="!z-40 flex h-auto w-full flex-col items-start gap-4 px-4 transition-all ease-in-out sm:px-0">
				{!profileCompleted && (
					<div className="z-10 flex w-full flex-col items-start gap-3">
						<div className="relative z-[2] flex h-full w-full items-center gap-2 overflow-hidden rounded-2xl border border-primary bg-white p-6">
							<div className="item-center flex flex-[8] flex-row">
								<div className="flex max-w-[152px] flex-[2] flex-col text-title max-sm:gap-1">
									<h3 className="text-2xl text-[50px] font-bold leading-[54px]">
										{profileCompleteness}%
									</h3>
									<p className="text-base">of your profile is completed</p>
								</div>
								<div className="flex flex-[7] flex-col gap-2 border-l-[1px] border-[#e8e8e8] pl-[24px]">
									<p className="w-[400px] text-base leading-6 tracking-[0.75px] text-body">
										The more complete it is, the more likely you are to start a collaboration
									</p>
									<div className="h-[48px] w-[226px]">
										<Button
											variant="primary"
											size="lg"
											onClick={() => {
												router.push("/settings");
											}}
											className="h-full w-max"
										>
											<span>Complete Profile</span>
										</Button>
									</div>
								</div>
							</div>
							<UserCheck className="absolute -right-2 top-1 h-[221px] w-[221px] !scale-x-[-1] transform text-[#1F6695] opacity-20" />
						</div>
					</div>
				)}
			</div>
		);
	}

	if (userHasDoneKyc) {
		return (
			<div className="grid min-h-[100px] grid-cols-2 gap-4">
				<div className="relative h-full overflow-hidden rounded-2xl border border-[#7dde86] bg-[#CEFCE5]/20 p-4 shadow-sm">
					<div className="relative z-10 flex items-center justify-between gap-4">
						<p className="max-w-[300px] text-[22px] font-medium text-title">
							Create jobs <br /> and pay in crypto
						</p>
						<Button
							size="lg"
							onClick={() => {
								router.push("/jobs/create");
							}}
							variant="primary"
							className="flex w-max items-center gap-4 text-[19.06px]"
						>
							<Plus size={20} />
							<span>Create</span>
						</Button>
					</div>

					<div className="absolute -left-4 top-2 opacity-[15%]">
						<Briefcase size={111} color="#23C16B" />
					</div>
				</div>
				<div className="relative z-10 h-full overflow-hidden rounded-2xl border border-blue-lighter bg-white p-4 shadow-sm">
					<div className="relative z-10 flex items-center justify-between gap-4">
						<p className="max-w-[320px] text-[22px] font-medium text-title">
							Search for work <br /> and earn crypto
						</p>
						<Button
							variant="secondary"
							size="lg"
							onClick={() => {
								router.push("/jobs");
							}}
							className="flex w-max items-center gap-4 border border-[#3055b3] text-[19.06px]"
						>
							<Search size={20} />
							<span>Earn</span>
						</Button>
					</div>

					<div className="absolute -left-2 top-0 scale-x-[-1] opacity-[8%]">
						<Search size={111} color="#4949D3" />
					</div>
				</div>
			</div>
		);
	}

	return null;
};
