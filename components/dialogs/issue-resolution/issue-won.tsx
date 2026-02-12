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

interface IssueWonProps {
	isOpen: boolean;
	fundsAmount: string;
	setIsOpen: (isOpen: boolean) => void;
}

const IssueWon = ({ isOpen, fundsAmount, setIsOpen }: IssueWonProps) => {
	if (isOpen)
		return (
			// @ts-expect-error ----
			<ResultsModal
				{...{
					verdict: "won",
					fundsAmount,
					chainsiteName: "pakt.build",
					isOpen,
					onClose: () => setIsOpen(false),
				}}
			/>
		);

	return null;
};

export default IssueWon;
