"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type FC, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import * as RadixTabs from "@radix-ui/react-tabs";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { createQueryString, cn } from "@/lib/utils";
// import { useSignUpDialogState } from "@/lib/store/security";

interface Tab {
	label: JSX.Element | string;
	value: string;
	content: React.ReactNode;
	disabled?: boolean;
}

interface Props {
	tabs: Tab[];
	urlKey?: string;
	defaultTab?: string;
	className?: string;
	tabListClassName?: string;
	tabTriggerClassName?: string;
	customExtraComponent?: React.ReactNode;
	customExtraItem?: React.ReactNode;
	tabContentContainerClassName?: string;
	tabListStyle?: React.CSSProperties;
}

export const Tabs: FC<Props> = ({
	tabs,
	defaultTab,
	urlKey,
	className,
	tabListClassName,
	tabTriggerClassName,
	customExtraComponent,
	customExtraItem,
	tabContentContainerClassName,
	tabListStyle,
}) => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// const { open: showSignUpDialog } = useSignUpDialogState();
	const urlTab = searchParams.get(urlKey ?? "tab");
	const initialTab = urlTab ?? defaultTab ?? tabs[0]?.value;
	const [activeTab, setActiveTab] = useState(initialTab);

	const handleTabChange = (value: string): void => {
		setActiveTab(value);
		// update the URL whenever the tab changes
		router.push(`${pathname}?${createQueryString(urlKey ?? "tab", value)}`);
	};

	// update the state whenever the URL changes
	useEffect(() => {
		if (urlTab) {
			setActiveTab(urlTab);
		}
	}, [urlTab]);

	return (
		<RadixTabs.Root
			value={activeTab}
			defaultValue={initialTab}
			onValueChange={handleTabChange}
			className={cn(
				`relative flex w-full flex-col items-start justify-start max-sm:border-t max-sm:border-gray-200 max-sm:bg-white
				sm:h-full `,
				className
			)}
		>
			<RadixTabs.List
				className={cn(
					"flex w-full items-center border-b max-sm:h-[64px] max-sm:justify-between max-sm:bg-white",
					tabListClassName
				)}
				style={tabListStyle}
			>
				{tabs.map((tab) => (
					<RadixTabs.Trigger
						key={tab.value}
						value={tab.value}
						className={cn(
							`border-b-2 border-transparent py-5 text-center text-sm font-medium text-gray-500 transition-all duration-200
							hover:text-primary radix-disabled:cursor-not-allowed radix-state-active:border-primary radix-state-active:text-title
							sm:min-w-[100px] sm:px-8 sm:py-2`,
							tabTriggerClassName
						)}
						disabled={tab.disabled ?? pathname === "/"}
					>
						{tab.label}
					</RadixTabs.Trigger>
				))}
				{customExtraItem}
			</RadixTabs.List>
			{customExtraComponent}
			<div
				className={`scrollbar-hide relative w-full sm:mt-4 sm:h-full sm:overflow-y-auto ${tabContentContainerClassName}`}
			>
				{tabs.map((tab) => (
					<RadixTabs.Content
						key={tab.value}
						value={tab.value}
						className="w-full justify-start data-[state=active]:flex data-[state=active]:h-full data-[state=active]:flex-col sm:h-full"
					>
						{tab.content}
					</RadixTabs.Content>
				))}
			</div>
		</RadixTabs.Root>
	);
};
