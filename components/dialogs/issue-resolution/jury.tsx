"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

const JuryModal = dynamic(() => import("@pakt/issue-resolution").then((mod) => mod.JuryModal), {
	ssr: false,
});

interface JuryInviteProps {
	isOpen: boolean;
	issueId: string;
	setIsOpen: (isOpen: boolean) => void;
}

const JuryInvite = ({ isOpen, setIsOpen, issueId }: JuryInviteProps) => {
	if (isOpen)
		return (
			// @ts-expect-error ----
			<JuryModal
				{...{
					issueId,
					isOpen: isOpen,
					onClose: () => setIsOpen(false),
				}}
			/>
		);

	return null;
};

export default JuryInvite;
