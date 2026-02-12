"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

const DefendantModal = dynamic(() => import("@pakt/issue-resolution").then((mod) => mod.DefendantModal), {
	ssr: false,
});

interface IssueDefenseProps {
	isOpen: boolean;
	issueId: string;
	setIsOpen: (isOpen: boolean) => void;
}

const IssueDefense = ({ isOpen, setIsOpen, issueId }: IssueDefenseProps) => {
	if (isOpen)
		return (
			// @ts-expect-error ----
			<DefendantModal
				{...{
					issueId,
					chainsiteName: "pakt.build",
					isOpen: isOpen,
					onClose: () => setIsOpen(false),
				}}
			/>
		);

	return null;
};

export default IssueDefense;
