"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import type * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { baseCreateJobSchema } from "@/lib/validations";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";
import { useKyc } from "@/lib/store/kyc";
import { useUserState } from "@/lib/store/account";
import { ENVS } from "@/config";
import CreateJobForm from "@/collection/create-collection";
import Steps from "@/collection/create-collection/indicator";
// import { CREATE_JOB_TEMPLATE } from "@/lib/constants";
// import { sentenceCase } from "@/lib/utils";

type FormValues = z.infer<typeof baseCreateJobSchema>;

export default function CreateJobPage(): JSX.Element {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const { user } = useUserState();
	const { kyc } = user || {};

	const { setOpenKycModal, setDisableClickOutside } = useKyc();

	useEffect(() => {
		if (ENVS.isProduction) {
			if (!kyc) {
				setOpenKycModal(true);
				setDisableClickOutside(true);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [kyc]);

	const form = useForm<FormValues>({
		resolver: zodResolver(baseCreateJobSchema),
		mode: "onChange", // Validate on change
		// defaultValues: {
		// 	title: CREATE_JOB_TEMPLATE.title, //+
		// 	budget: CREATE_JOB_TEMPLATE.budget, //+
		// 	due: CREATE_JOB_TEMPLATE.due, //+
		// 	firstSkill: CREATE_JOB_TEMPLATE.firstSkill, //+
		// 	secondSkill: CREATE_JOB_TEMPLATE.secondSkill, //+
		// 	thirdSkill: CREATE_JOB_TEMPLATE.thirdSkill, //+
		// 	description: CREATE_JOB_TEMPLATE.description, //+
		// 	deliverables: CREATE_JOB_TEMPLATE.deliverables, //+
		// 	category: {
		// 		value: CREATE_JOB_TEMPLATE.category,
		// 		label: sentenceCase(CREATE_JOB_TEMPLATE.category),
		// 	},
		// 	visibility: {
		// 		value: CREATE_JOB_TEMPLATE.visibility,
		// 		label: sentenceCase(CREATE_JOB_TEMPLATE.visibility),
		// 	},
		// 	coin: CREATE_JOB_TEMPLATE.coin, //+
		// },
	});

	const jobSteps = {
		details:
			form.watch("title") !== "" &&
			!form.getFieldState("title").invalid &&
			form.watch("due") !== undefined &&
			!form.getFieldState("due").invalid &&
			form.watch("budget") !== 0 &&
			!form.getFieldState("budget").invalid &&
			form.watch("coin") !== undefined &&
			!form.getFieldState("coin").invalid,
		skills:
			form.watch("firstSkill") !== "" &&
			form.watch("firstSkill") !== undefined &&
			!form.getFieldState("firstSkill").invalid &&
			form.watch("secondSkill") !== "" &&
			form.watch("secondSkill") !== undefined &&
			!form.getFieldState("secondSkill").invalid &&
			form.watch("thirdSkill") !== "" &&
			form.watch("thirdSkill") !== undefined &&
			!form.getFieldState("thirdSkill").invalid &&
			form.watch("thirdSkill") !== form.watch("secondSkill") &&
			form.watch("thirdSkill") !== form.watch("firstSkill") &&
			form.watch("secondSkill") !== form.watch("firstSkill"),
		description:
			form.watch("description") !== "" &&
			form.watch("description") !== undefined &&
			!form.getFieldState("description").invalid,
		deliverables:
			Array.isArray(form.watch("deliverables")) &&
			form.watch("deliverables").filter((r) => r !== undefined && r !== "").length > 0 &&
			!form.getFieldState("deliverables").invalid,
		classification:
			form.watch("visibility") !== undefined &&
			!form.getFieldState("visibility").invalid &&
			form.watch("category") !== undefined &&
			!form.getFieldState("category").invalid,
	};

	if (isMobile) {
		return (
			<div className="relative flex w-full flex-col overflow-y-auto pb-[64px]">
				<MobileBreadcrumb
					items={[
						{
							label: "Jobs",
							link: "/jobs",
						},
						{
							label: "Create Job",
							link: "/jobs/create",
							active: true,
						},
					]}
					className="!fixed top-[70px] !bg-[#0E1319]"
				/>
				<CreateJobForm form={form} jobSteps={jobSteps} />
			</div>
		);
	}
	return (
		<div className="flex h-full w-full overflow-y-auto max-sm:flex-col sm:gap-6 sm:pb-10 xl:px-4 2xl:px-8">
			<CreateJobForm form={form} jobSteps={jobSteps} />
			<div className="sticky top-0 flex shrink-0 grow-0 basis-[300px] flex-col gap-6">
				<Steps jobSteps={jobSteps} />
			</div>
		</div>
	);
}
