"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { memo } from "react";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import SignupPage from "@/widgets/authentication/_shared/signup";
import { useGetParams } from "@/hooks/use-get-params";
import { AuthEnums } from "@/lib/enums";

const SignUpDialog = (): JSX.Element => {
	const router = useRouter();
	const auth = useGetParams("auth");
	return (
		<Modal
			isOpen={auth === AuthEnums.SIGNUP}
			closeModal={() => {
				router.push("/");
			}}
			// disableClickOutside
		>
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				<SignupPage />
				<div className="flex w-full items-center justify-end">
					<PoweredByPakt className="!text-white" />
				</div>
			</div>
		</Modal>
	);
};

export default memo(SignUpDialog);
