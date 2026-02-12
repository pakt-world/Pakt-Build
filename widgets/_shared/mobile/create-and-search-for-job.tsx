"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Plus, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useMobileContext } from "@/providers/mobile-context-provider";
import { Button } from "@/components/common/button";

export const JobActions = (): JSX.Element => {
	const router = useRouter();
	const pathname = usePathname();
	const [showButtons, setShowButtons] = useState(false);

	const { showOpenJobs } = useMobileContext();

	const toggleButtons = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		setShowButtons(!showButtons);
	};
	const showJobAction = pathname === "/dashboard" || pathname === "/jobs";

	return (
		<div
			className={`${showJobAction && !showOpenJobs ? "block" : "hidden"} fixed bottom-[15%] right-2 z-30 sm:hidden`}
		>
			<div className="relative">
				<div
					className={`absolute right-0 top-0 flex w-[134px] origin-bottom-right flex-col items-end space-y-2 transition-all
						${showButtons ? "z-10 -translate-y-[120%] opacity-100" : "z-1 -translate-y-[0] opacity-0"} `}
				>
					<Button
						className="flex items-center gap-2.5"
						variant="secondaryOutline"
						size="lg"
						onClick={() => {
							setShowButtons(false);
							router.push("/jobs/create");
						}}
						fullWidth
					>
						<Plus size={20} /> Create
					</Button>
					<Button
						className="flex items-center gap-2.5"
						variant="primary"
						size="lg"
						onClick={() => {
							setShowButtons(false);
							router.push("/jobs");
						}}
						fullWidth
					>
						<Search size={20} /> Earn
					</Button>
				</div>
				<div className="relative">
					<Button
						className="relative z-20 h-[68px] w-[68px] cursor-pointer rounded-full bg-primary-gradient-light px-4 py-2 text-white !opacity-100
							shadow hover:!bg-primary"
						onClick={toggleButtons}
						type="button"
					>
						<Plus size={37} className={`transform transition-all ${showButtons ? "rotate-45" : ""}`} />
					</Button>
					<div className="cancel-drag" />
				</div>
			</div>
		</div>
	);
};
