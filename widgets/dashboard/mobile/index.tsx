/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUserState } from "@/lib/store/account";
import { userKycIsApproved } from "@/lib/utils";
import { KycVerificationStatus } from "@/lib/enums";
import { useMobileContext } from "@/providers/mobile-context-provider";
import { CompleteProfile4Mobile } from "./complete-profile";
import { DashboardTabs4Mobile } from "./tabs";

const Dashboard4Mobile = () => {
	const { user } = useUserState();
	const { kycStatus, profileCompleteness } = user ?? {};

	const { isAtTop } = useMobileContext();
	const profileCompleted = (profileCompleteness as number) > 70;
	const userHasDoneKyc = userKycIsApproved(kycStatus ?? KycVerificationStatus.EMPTY);

	const shouldResetMarginTop = !isAtTop || !profileCompleted || !userHasDoneKyc;

	const marginTopClass = shouldResetMarginTop ? "max-sm:mt-0" : "max-sm:mt-[70px]";

	return (
		<div
			className={`flex size-full flex-col justify-start transition-all duration-300 ease-in-out ${marginTopClass}`}
		>
			<CompleteProfile4Mobile />
			<DashboardTabs4Mobile />
		</div>
	);
};

export default Dashboard4Mobile;
