"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

const ResultsModal = dynamic(() => import("@pakt/issue-resolution").then((mod) => mod.ResultsModal), {
	ssr: false,
});

interface IssueLostProps {
	isOpen: boolean;
	fundsAmount: string;
	setIsOpen: (isOpen: boolean) => void;
}

const IssueLost = ({ isOpen, fundsAmount, setIsOpen }: IssueLostProps) => {
	if (isOpen)
		return (
			// @ts-expect-error ----
			<ResultsModal
				{...{
					verdict: "lost",
					fundsAmount,
					chainsiteName: "pakt.build",
					isOpen,
					onClose: () => setIsOpen(false),
				}}
			/>
		);

	return null;
};

export default IssueLost;
