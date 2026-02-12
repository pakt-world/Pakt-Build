"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { createVeriffFrame, MESSAGES } from "@veriff/incontext-sdk";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { Modal } from "@/components/common/modal";
import { useCreateKycSession } from "@/lib/api/kyc";
import Lottie from "@/components/common/lottie";
import { useGetAccount, useUpdateAccount } from "@/lib/api/account";
import { useKyc } from "@/lib/store/kyc";
import success from "@/lottiefiles/success.json";

import { Spinner } from "../../common/loader";
import { useSettingState } from "@/lib/store/settings";
// import { isProductionEnvironment } from "@/lib/utils";
// import { KycVerificationStatus } from "@/lib/enums";

const KycModal = (): JSX.Element => {
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const createSession = useCreateKycSession();

	const { openKycModal, setOpenKycModal, disableClickOutside, setDisableClickOutside } = useKyc();
	const { settings } = useSettingState();

	const {
		refetch: fetchAccount,
		// data: userData
	} = useGetAccount({ enable: openKycModal });
	const updateAccount = useUpdateAccount(true);

	const handleCreateSession = (): void => {
		setOpenKycModal(false);
		createSession.mutate("", {
			onSuccess: (data) => {
				const url = data?.verification?.url;
				createVeriffFrame({
					url,
					onEvent: (msg) => {
						switch (msg) {
							case MESSAGES.CANCELED:
								break;
							case MESSAGES.FINISHED:
								fetchAccount();
								break;
							default:
								break;
						}
					},
				});
			},
		});
	};

	// Timeout to close the modal after KYC is successful for Development Purposes
	useEffect(() => {
		if (showSuccessMessage) {
			setTimeout(() => {
				setShowSuccessMessage(false);
				setOpenKycModal(false);
			}, 3000);
		}
	}, [showSuccessMessage, setOpenKycModal, setShowSuccessMessage]);

	return (
		<Modal
			isOpen={openKycModal}
			onOpenChange={() => {
				setOpenKycModal(!openKycModal);
			}}
			className="h-fit max-w-[350px] !overflow-hidden rounded-2xl bg-white p-4 pt-6 sm:max-w-[587px] sm:p-6"
			disableClickOutside={disableClickOutside}
		>
			{showSuccessMessage ? (
				// For Development Purposes
				<div className="flex flex-col items-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-center text-xl font-medium">KYC Submitted Successfully</h2>
				</div>
			) : (
				<div className="relative flex w-full flex-col items-center justify-center gap-4 sm:gap-6">
					<button
						className="absolute right-0 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-body duration-200
							hover:border-body hover:text-body"
						onClick={() => {
							setOpenKycModal(false);
							setDisableClickOutside(false);
						}}
						type="button"
						aria-label="Close"
					>
						<X size={16} strokeWidth={2} />
					</button>

					<Image
						src="/images/user-identifier-card.png"
						width={133}
						height={104}
						className=""
						alt="user-identifier-card"
					/>
					<h3 className="text-lg font-bold leading-[31.20px] tracking-wide text-title sm:text-2xl">
						Verify Your Identity
					</h3>
					<p className="w-[291px] text-center text-sm leading-[150%] text-title sm:w-full sm:text-lg sm:leading-[27px] sm:tracking-wide">
						Global regulations <span className="font-bold">require KYC</span> to prevent money laundering
						and terrorist financing.{" "}
						<span className="text-[#0067DB]">Pakt does not store your personal information</span>, only the
						status of your KYC submission performed by industry-leader{" "}
						<Link
							href={`${settings?.veriff_url}` as string}
							target="_blank"
							className="text-sm leading-[150%] text-[#17A2B8] underline sm:text-lg sm:leading-[27px] sm:tracking-wide"
						>
							Veriff.
						</Link>
					</p>

					<Button
						variant="primary"
						type="button"
						onClick={() => {
							// if (isProductionEnvironment) {
							handleCreateSession();
							// } else {
							// 	const payload = {
							// 		meta: {
							// 			...userData?.meta,
							// 			kycStatus_dev: KycVerificationStatus.APPROVED,
							// 		},
							// 	};
							// 	updateAccount.mutate(payload, {
							// 		onSuccess: () => {
							// 			setShowSuccessMessage(true);
							// 		},
							// 		onError: () => {
							// 			// @ts-ignore
							// 			setAgreed(null);
							// 		},
							// 	});
							// }
						}}
						className="w-full"
					>
						{createSession.isLoading || updateAccount.isLoading ? <Spinner size={18} /> : "Setup KYC"}
					</Button>
				</div>
			)}
		</Modal>
	);
};

export default memo(KycModal);
