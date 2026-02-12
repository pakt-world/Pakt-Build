/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import empty from "@/lottiefiles/empty.json";
import Lottie from "@/components/common/lottie";

interface Props {
	label?: string;
	className?: string;
	children?: React.ReactNode;
}

export const PageEmpty: FC<Props> = ({ className, label, children }) => {
	return (
		<div
			aria-live="polite"
			aria-busy="true"
			className={cn("flex h-screen w-full items-center justify-center bg-white", className)}
		>
			<div className="flex flex-col items-center">
				<div className="flex w-full max-w-[150px] items-center justify-center sm:max-w-[250px]">
					<Lottie animationData={empty} loop={false} />
				</div>
				<span className="max-w-md text-center text-sm text-body sm:text-lg">
					{label ?? "Nothing to show yet."}
				</span>
				{children}
			</div>
		</div>
	);
};
