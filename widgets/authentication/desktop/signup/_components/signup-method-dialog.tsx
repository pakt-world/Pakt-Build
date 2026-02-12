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
import { SignupMethod } from "@/widgets/authentication/_shared/auth-method/signup-method";

const SignupMethodDialog = (): JSX.Element => {
	const router = useRouter();
	const auth = useGetParams("auth");
	return (
		<Modal
			isOpen={auth === "signup_method"}
			closeModal={() => {
				router.push("/");
			}}
			// disableClickOutside
		>
			<SignupMethod />
		</Modal>
	);
};

export default memo(SignupMethodDialog);
