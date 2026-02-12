"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatNumber } from "@/lib/utils";
import { useGetJobById } from "@/lib/api/job";
import { useEffect } from "react";

const ReportModal = dynamic(() => import("@pakt/issue-resolution").then((mod) => mod.ReportModal), {
	ssr: false,
});

interface IssueReportProps {
	isOpen: boolean;
	jobId: string;
	setIsOpen: (isOpen: boolean) => void;
}

const IssueReport = ({ isOpen, setIsOpen, jobId }: IssueReportProps) => {
	const query = useGetJobById({ jobId });

	const job = query.data;

	useEffect(() => {
		return () => {
			setIsOpen(false);
		};
	}, [setIsOpen]);

	if (isOpen)
		return (
			<ReportModal
				collectionId={jobId}
				chainsiteName="pakt.build"
				fundsAtStake={`$${formatNumber(Number(job?.usdExpectedAmount || 0))}`}
				onClose={() => setIsOpen(false)}
				isOpen={isOpen}
			/>
		);

	return null;
};

export default IssueReport;
