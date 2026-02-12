"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { Button } from "@/components/common/button";
import { useUpdateAccount } from "@/lib/api/account";
import { useSignUpDialogState } from "@/lib/store/security";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { AuthEnums } from "@/lib/enums";
import { Checkbox } from "@/components/common/checkbox";
import { toast } from "@/components/common/toaster";
import { TC } from "@/widgets/authentication/_shared/terms-and condition";

export default function TermsConditionPage(): JSX.Element {
	const containerRef = useRef<HTMLDivElement>(null);

	const router = useRouter();

	const { agreed, setAgreed } = useSignUpDialogState();

	const updateAccount = useUpdateAccount(true);
	const queryClient = useQueryClient();

	const handleUpdate = (accepted: boolean): void => {
		const payload = {
			meta: {
				acceptedTerms: accepted,
			},
		};
		updateAccount.mutate(payload, {
			onSuccess: () => {
				if (accepted) {
					router.push(`/${AuthEnums.ONBOARDING}`);
				} else {
					toast.error("Terms and Conditions declined");
					router.push("/");
					queryClient.clear();
					deleteCookie(AUTH_TOKEN_KEY);
				}
			},
			onError: () => {
				// @ts-ignore
				setAgreed(null);
			},
		});
	};

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = 0;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [containerRef.current]);

	return (
		<div className="z-[2] flex h-[calc(100dvh-70px)] w-full flex-col gap-4 py-4">
			<div className="flex flex-none flex-col items-start gap-2">
				<h3 className="font-sans text-xl font-bold leading-[30px] tracking-[0.75px] text-black sm:text-3xl sm:text-white">
					Welcome to pakt.build
				</h3>
				<p className="text-sm font-normal leading-[21px] tracking-[0.75px] text-body sm:text-white">
					The following Terms and Conditions have been updated. You must accept these before continuing. Hence
					terms and condition cover important information, so please read them carefully.
				</p>
			</div>
			<div
				ref={containerRef}
				className="flex flex-1 flex-col items-start gap-2 overflow-y-auto rounded-2xl border border-line p-4 text-body-light shadow
					max-sm:bg-white sm:p-6"
			>
				<TC />
			</div>
			<div className="flex w-full flex-none flex-col items-center justify-between gap-4">
				<div className="flex items-center gap-2 max-sm:w-full">
					<Checkbox checked={agreed} onCheckedChange={setAgreed} />
					<span className="text-base text-body">I have read the terms and conditions</span>
				</div>
				<div className="flex items-center gap-4 max-sm:w-full">
					<Button
						size="lg"
						className="max-sm:w-full"
						variant="outlinePrimary"
						onClick={() => {
							setAgreed(false);
							handleUpdate(false);
						}}
						disabled={updateAccount.isLoading}
					>
						{updateAccount.isLoading && !agreed ? <Spinner /> : "Decline"}
					</Button>
					<Button
						className="max-sm:w-full"
						disabled={!agreed || updateAccount.isLoading}
						variant="primary"
						size="lg"
						onClick={() => {
							setAgreed(true);
							handleUpdate(true);
						}}
					>
						{updateAccount.isLoading && agreed ? <Spinner /> : "Accept"}
					</Button>
				</div>
			</div>
		</div>
	);
}
