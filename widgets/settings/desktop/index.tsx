/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Tabs } from "@/components/common/tabs";
import { SecurityView } from "@/widgets/settings/desktop/security";
import { EditProfile4Desktop } from "./edit-profile";

export const DesktopSettingsView = (): JSX.Element => {
	return (
		<div className="relative flex h-full flex-col gap-8 overflow-y-auto xl:px-4 2xl:px-8">
			<Tabs
				tabs={[
					{
						label: "Profile",
						value: "profile",
						content: <EditProfile4Desktop />,
					},
					{
						label: "Security",
						value: "security",
						content: <SecurityView />,
					},
					// { label: 'Notification', value: 'notification', content: <NotificationView /> },
				]}
			/>
		</div>
	);
};
