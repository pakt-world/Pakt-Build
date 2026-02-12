"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { OpenJobs4Mobile } from "@/collection/open-collections/mobile";
import { CreatedJobs4Mobile } from "@/collection/created-collections/mobile";
import { AssignedJobs4Mobile } from "@/collection/assigned-collections/mobile";
import { CollectionCategory } from "@/lib/enums";
import { titleCase } from "@/lib/utils";

interface TabTriggerProps {
	value: string;
	label: string;
}

function TabTrigger({ label, value }: TabTriggerProps): React.JSX.Element {
	return (
		<RadixTabs.Trigger
			value={value}
			className="flex items-center justify-center rounded-lg px-6 py-1 text-title duration-200 hover:bg-white hover:text-black
				radix-state-active:bg-white radix-state-active:text-black"
		>
			{label}
		</RadixTabs.Trigger>
	);
}

export default function JobsMobileView(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const urlTab = searchParams.get("jobs-type") as CollectionCategory;
	const [activeTab, setActiveTab] = useState<CollectionCategory>(CollectionCategory.OPEN);

	const handleTabChange = (value: string): void => {
		const category = value as CollectionCategory;
		setActiveTab(category);
		router.push(`${pathname}?${createQueryString("jobs-type", category)}`);
	};

	useEffect(() => {
		if (urlTab != null) {
			setActiveTab(urlTab);
		}
	}, [urlTab]);

	return (
		<RadixTabs.Root
			value={activeTab}
			defaultValue={CollectionCategory.OPEN}
			onValueChange={handleTabChange}
			className="relative flex w-full flex-col bg-white max-sm:!overflow-y-auto sm:!h-full"
		>
			<div
				className="border-primary-light top-[70px] z-40 flex h-[61px] w-full items-center justify-between gap-4 bg-[#ebf6fc] px-5 py-2
					max-sm:fixed sm:h-max"
			>
				<RadixTabs.List className="grid w-full grid-cols-3 gap-1 rounded-lg bg-black/5 p-0.5">
					<TabTrigger value={CollectionCategory.OPEN} label={titleCase(CollectionCategory.OPEN)} />
					<TabTrigger value={CollectionCategory.CREATED} label={titleCase(CollectionCategory.CREATED)} />
					<TabTrigger value={CollectionCategory.ASSIGNED} label={titleCase(CollectionCategory.ASSIGNED)} />
				</RadixTabs.List>
			</div>

			<RadixTabs.Content value={CollectionCategory.OPEN}>
				<OpenJobs4Mobile />
			</RadixTabs.Content>
			<RadixTabs.Content value={CollectionCategory.CREATED}>
				<CreatedJobs4Mobile />
			</RadixTabs.Content>
			<RadixTabs.Content value={CollectionCategory.ASSIGNED}>
				<AssignedJobs4Mobile />
			</RadixTabs.Content>
		</RadixTabs.Root>
	);
}
