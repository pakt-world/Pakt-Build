"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useEffect, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import { Plus } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useKyc } from "@/lib/store/kyc";
import { CollectionCategory, KycVerificationStatus } from "@/lib/enums";
import { ENVS } from "@/config";
import { useUserState } from "@/lib/store/account";
import { titleCase } from "@/lib/utils";
import { Pending } from "@/components/dialogs/kyc";
import { kycIsPending } from "@/lib/actions/kyc";
import { Button } from "@/components/common/button";
import { OpenJobs4Desktop } from "@/collection/open-collections/desktop";
import { CreatedJobs4Desktop } from "@/collection/created-collections/desktop";
import { AssignedJobs4Desktop } from "@/collection/assigned-collections/desktop";

interface TabTriggerProps {
	value: string;
	label: string;
}

function TabTrigger({ label, value }: TabTriggerProps): JSX.Element {
	return (
		<RadixTabs.Trigger
			value={value}
			className="flex items-center justify-center rounded-lg px-6 py-1 duration-200 hover:bg-white radix-state-active:bg-white
				radix-state-active:text-title radix-state-active:shadow"
		>
			{label}
		</RadixTabs.Trigger>
	);
}

export default function JobsDesktopView(): JSX.Element {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { user } = useUserState();
	const { kyc = false, kycStatus = KycVerificationStatus.EMPTY } = user ?? {};

	const { setOpenKycModal } = useKyc();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams);
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const urlTab = searchParams.get("jobs-type") as CollectionCategory;
	const [activeTab, setActiveTab] = useState<CollectionCategory>(urlTab ?? CollectionCategory.OPEN);

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
			defaultValue="open"
			onValueChange={handleTabChange}
			className="flex h-full w-full flex-col gap-4 overflow-auto xl:px-4 2xl:px-8"
		>
			{kycIsPending(kyc, kycStatus) && <Pending />}
			<div className="flex w-full items-center justify-between gap-4">
				<RadixTabs.List className="grid w-fit grid-cols-3 gap-1 rounded-lg bg-tab-bg p-0.5 text-base text-body">
					<TabTrigger value={CollectionCategory.OPEN} label={titleCase(CollectionCategory.OPEN)} />
					<TabTrigger value={CollectionCategory.CREATED} label={titleCase(CollectionCategory.CREATED)} />
					<TabTrigger value={CollectionCategory.ASSIGNED} label={titleCase(CollectionCategory.ASSIGNED)} />
				</RadixTabs.List>

				{kycStatus !== KycVerificationStatus.REVIEW && kycStatus !== KycVerificationStatus.SUBMITTED && (
					<Button
						size="lg"
						onClick={() => {
							if (!ENVS.isProduction || kyc) {
								router.push("/jobs/create");
							} else if (kycStatus !== KycVerificationStatus.APPROVED) {
								setOpenKycModal(true);
							}
						}}
						variant="primary"
						className=""
					>
						<div className="flex items-center gap-2">
							<Plus size={20} />
							<span>Create Job</span>
						</div>
					</Button>
				)}
			</div>

			<RadixTabs.Content value={CollectionCategory.OPEN}>
				<OpenJobs4Desktop />
			</RadixTabs.Content>
			<RadixTabs.Content value={CollectionCategory.CREATED}>
				<CreatedJobs4Desktop />
			</RadixTabs.Content>
			<RadixTabs.Content value={CollectionCategory.ASSIGNED}>
				<AssignedJobs4Desktop />
			</RadixTabs.Content>
		</RadixTabs.Root>
	);
}
