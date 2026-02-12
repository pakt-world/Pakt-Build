"use client";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import { useGetParams } from "@/hooks/use-get-params";
import SignUpVerificationPage from "@/widgets/authentication/_shared/signup/verify";
import { AuthEnums } from "@/lib/enums";

const VerifySignUpDialog = (): JSX.Element => {
	const router = useRouter();
	const auth = useGetParams("auth");

	return (
		<Modal
			isOpen={auth === AuthEnums.VERIFY_SIGNUP || auth === AuthEnums.VERIFY_SIGNUP_SUCCESS}
			closeModal={() => {
				router.push("/");
			}}
			disableClickOutside
		>
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				<SignUpVerificationPage />
				<div className="flex w-full items-center justify-end">
					<PoweredByPakt className="!text-white" />
				</div>
			</div>
		</Modal>
	);
};

export default memo(VerifySignUpDialog);
