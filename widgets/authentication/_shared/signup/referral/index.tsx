"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";
import { useValidateReferral } from "@/lib/api/referral";
import { Spinner } from "@/components/common/loader";
import warning from "@/lottiefiles/warning-2.json";
import Lottie from "@/components/common/lottie";
import SignupReferralForm from "./_components/referral-signup-form";

export default function SignupReferralPage(): JSX.Element {
	const validateRef = useValidateReferral();
	const params = useParams();
	const [isLoading, _setIsLoading] = useState(true);
	const [errorMsg, _setErrorMsg] = useState(false);
	const referralCode = String(params.code);

	const validateReferral = (): void => {
		if (referralCode === "") {
			// throw error
			_setErrorMsg(true);
			_setIsLoading(false);
		}
		// validate code here
		validateRef.mutate(
			{
				token: referralCode,
			},
			{
				onSuccess: () => {
					_setIsLoading(false);
				},
				onError: () => {
					_setErrorMsg(true);
					_setIsLoading(false);
				},
			}
		);
	};

	useEffect(() => {
		validateReferral();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="z-[2] flex w-full items-center sm:mx-auto sm:size-full">
			{!isLoading && !errorMsg && (
				<div className="flex size-full flex-col items-center justify-center gap-6 max-sm:pb-8">
					<div className="flex flex-col items-center gap-2 text-center text-white">
						<h3 className="font-sans text-2xl font-bold sm:text-3xl">Create Your Account</h3>
						<p className="w-[392px] text-center text-base leading-normal tracking-tight text-white">
							Connect with world-class builders
						</p>
					</div>
					<SignupReferralForm referralCode={referralCode} />
				</div>
			)}
			{isLoading && <Spinner className="h-full text-white" />}
			{!isLoading && errorMsg && (
				<Container
					className="mt-28 flex w-full max-w-xl flex-col items-center justify-center gap-2 rounded-2xl border border-white border-opacity-20
						bg-[rgba(0,124,91,0.20)] p-8 px-[40px] py-10 text-center text-white backdrop-blur-md sm:mt-28"
				>
					<div className="flex w-full max-w-[150px] items-center justify-center">
						<Lottie animationData={warning} />
					</div>
					<h3 className="text-2xl font-bold sm:text-3xl">Invalid Referral Code</h3>
					<h6 className="flex-wrap text-base font-thin opacity-80 sm:text-lg">
						You need a valid referral code to be able to sign up to Afrofund.{" "}
					</h6>
				</Container>
			)}
		</div>
	);
}
