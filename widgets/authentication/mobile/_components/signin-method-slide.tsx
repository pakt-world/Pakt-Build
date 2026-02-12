"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetParams } from "@/hooks/use-get-params";
import { SigninMethod } from "@/widgets/authentication/_shared/auth-method/login-method";

const SigninMethodSlide = (): JSX.Element => {
	const auth = useGetParams("auth");

	return (
		<AnimatePresence>
			{auth === "signin_method" && (
				<motion.div
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					exit={{ x: "100%" }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="fixed right-0 top-0 z-[999] size-full bg-[#E5F6FF] p-6 shadow-xl"
				>
					<SigninMethod />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default memo(SigninMethodSlide);
