"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Modal } from "@/components/common/headless-modal";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import { useGetParams } from "@/hooks/use-get-params";
import { AuthEnums } from "@/lib/enums";
import ResetPasswordForm from "../../_shared/forgot-password/_components/reset-password-form";

const ResetPasswordDialog = (): JSX.Element => {
	const router = useRouter();
	const auth = useGetParams("auth");

	return (
		<Modal
			isOpen={auth === AuthEnums.FORGOT_PASSWORD_RESET || auth === AuthEnums.FORGOT_PASSWORD_RESET_SUCCESS}
			closeModal={() => {
				router.push("/");
			}}
			disableClickOutside
		>
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				<ResetPasswordForm />
				<div className="flex w-full items-center justify-end">
					<PoweredByPakt className="!text-white" />
				</div>
			</div>
		</Modal>
	);
};

export default memo(ResetPasswordDialog);
