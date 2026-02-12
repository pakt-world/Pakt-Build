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
import { useGetParams } from "@/hooks/use-get-params";
import { SigninMethod } from "@/widgets/authentication/_shared/auth-method/login-method";

const SigninMethodDialog = (): JSX.Element => {
	const router = useRouter();
	const auth = useGetParams("auth");
	return (
		<Modal
			isOpen={auth === "signin_method"}
			closeModal={() => {
				router.push("/");
			}}
			// disableClickOutside
		>
			<SigninMethod />
		</Modal>
	);
};

export default memo(SigninMethodDialog);
