"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import { usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { ChatList } from "@/widgets/messages/_shared/chat-list";

interface Props {
	children: React.ReactNode;
}

export default function MessagesLayout({ children }: Props): JSX.Element {
	const mobile = useMediaQuery("(max-width: 640px)");
	const pathname = usePathname();
	// Check if pathname is /messages/:messageId
	const isChatPage = pathname.includes("/messages/");

	if (mobile) {
		return (
			<div className="flex w-full flex-col overflow-y-auto">
				{!isChatPage && <ChatList />}
				<div className="z-40 size-full shadow sm:rounded-lg sm:rounded-l-none sm:border sm:border-l-0 sm:border-line sm:bg-white">
					{children}
				</div>
			</div>
		);
	}

	return (
		<div className="flex size-full flex-col gap-0 xl:px-4 2xl:px-8">
			<div className="relative flex size-full sm:h-[calc(100%-20px)]">
				<ChatList />
				<div className="z-40 size-full shadow sm:rounded-lg sm:rounded-l-none sm:border sm:border-l-0 sm:border-line sm:bg-white">
					{children}
				</div>
			</div>
		</div>
	);
}
