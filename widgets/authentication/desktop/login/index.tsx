"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

// import { useRouter } from "next/navigation";
import { memo } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import LoginForm from "@/widgets/authentication/_shared/login/_components/login-form";
import { Modal } from "../../../../components/common/headless-modal";
import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import { useGetParams } from "@/hooks/use-get-params";
import { AuthEnums } from "@/lib/enums";

const LogInDialog = (): JSX.Element => {
	// const router = useRouter();
	const auth = useGetParams("auth");

	return (
		<Modal
			isOpen={auth === AuthEnums.LOGIN}
			closeModal={() => {
				// router.push("/");
			}}
			disableClickOutside
		>
			<div className="z-[2] flex size-full flex-col items-center justify-center gap-6">
				<div className="flex flex-col items-center gap-2 text-center text-white">
					<h3 className="font-sans text-2xl font-bold sm:text-3xl">Login to your account</h3>
					<p className="font-sans text-base leading-normal tracking-tight">
						Collaborate with world-class builders
					</p>
				</div>
				<LoginForm />
				<div className="flex w-full items-center justify-end">
					<PoweredByPakt className="!text-white" />
				</div>
			</div>
		</Modal>
	);
};

export default memo(LogInDialog);
