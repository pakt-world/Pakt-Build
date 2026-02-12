/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { PoweredByPakt } from "@/components/common/powered-by-pakt";
import LeaderBoard from "@/widgets/dashboard/desktop/leaderboard";
import { DashboardHeader } from "@/widgets/dashboard/desktop/header";
import { Kyc } from "@/components/dialogs/kyc";
import { DesktopCallToAction } from "@/widgets/dashboard/desktop/header/complete-profile";
import { DashboardTabs4Desktop } from "@/widgets/dashboard/desktop/tabs";

const Dashboard4Desktop = () => {
	return (
		<div className="flex size-full justify-start px-4 2xl:gap-6 2xl:px-8">
			<div className="relative flex size-full grow flex-col gap-6">
				<DashboardHeader />
				<Kyc />
				<DesktopCallToAction />
				<DashboardTabs4Desktop />
			</div>
			<div
				className="scrollbar-hide z-20 flex h-full w-full shrink-0 flex-grow basis-[273px] flex-col items-center justify-start
					overflow-y-auto"
			>
				<div className="scrollbar-hide flex h-max w-full origin-top-right transform flex-col items-center gap-2 xl:scale-90 2xl:scale-100">
					<LeaderBoard />
					<PoweredByPakt />
				</div>
			</div>
		</div>
	);
};

export default Dashboard4Desktop;
