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
import { SignupMethod } from "@/widgets/authentication/_shared/auth-method/signup-method";

const SignupMethodSlide = (): JSX.Element => {
	const auth = useGetParams("auth");
	return (
		<AnimatePresence>
			{auth === "signup_method" && (
				<motion.div
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					exit={{ x: "100%" }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="fixed right-0 top-0 z-[999] size-full bg-[#E5F6FF] p-6 shadow-xl"
				>
					<SignupMethod />
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default memo(SignupMethodSlide);
