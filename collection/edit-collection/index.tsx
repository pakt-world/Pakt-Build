"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import type * as z from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUpdateJob, useInviteTalentToJob } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { cn, filterEmptyStrings, JOB_DIGIT, roundDown } from "@/lib/utils";
import { baseCreateJobSchema } from "@/lib/validations";
import { useExchangeRateStore } from "@/lib/store/misc";
import { isJobApplicant, isJobDeliverable } from "@/lib/actions/collection";
import { CollectionProps } from "@/lib/types/collection";
import { Button } from "../../components/common/button";
import JobTitle from "../create-collection/title";
import Steps from "../create-collection/indicator";
import JobProposedPrice from "../create-collection/payment-fee";
import JobDueDate from "../create-collection/due-date";
import PreferredSkills from "../create-collection/preferred-skills";
import JobDescription from "../create-collection/description";
import JobDeliverables from "../create-collection/deliverables";
import JobCategory, { CATEGORY_OPTIONS } from "../create-collection/category";
import JobVisibility, { VISIBILITY_OPTIONS } from "../create-collection/visibility";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface JobEditFormProps {
	job: CollectionProps;
}

export const EditJobForm: FC<JobEditFormProps> = ({ job }) => {
	const router = useRouter();
	const params = useSearchParams();

	const { data: rates } = useExchangeRateStore();

	const talentId = params.get("talent-id") ?? "";
	const inviteTalent = useInviteTalentToJob({ talentId, job });

	const form = useForm<FormValues>({
		reValidateMode: "onChange",
		resolver: zodResolver(baseCreateJobSchema),
		defaultValues: {
			title: job?.name,
			budget: job?.meta?.usdInitialValue,
			due: job?.deliveryDate ? new Date(job?.deliveryDate) : undefined,
			firstSkill: job?.tagsData[0] ?? "",
			thirdSkill: job?.tagsData[2] ?? "",
			secondSkill: job?.tagsData[1] ?? "",
			description: job?.description,
			deliverables: job.collections.filter(isJobDeliverable).map((collection) => collection.name),
			category: CATEGORY_OPTIONS.find((option) => option.value === job?.category),
			visibility: job?.isPrivate ? VISIBILITY_OPTIONS[0] : VISIBILITY_OPTIONS[1],
			coin: job?.meta?.coin ?? undefined,
		},
	});

	const c = form.watch("coin");
	const coinRate = c?.reference && rates?.[c.reference] !== undefined ? rates[c.reference] : 0;
	const amount = form.watch("budget");
	const totalValue = roundDown(String(coinRate && amount / coinRate), JOB_DIGIT);

	const enableSuccessToast = talentId && !job.escrowPaid ? false : true;

	const updateJob = useUpdateJob(enableSuccessToast);

	const onSubmit: SubmitHandler<FormValues> = async ({
		budget,
		category,
		deliverables,
		description,
		due,
		firstSkill,
		coin,
		title,
		visibility,
		secondSkill,
		thirdSkill,
	}) => {
		updateJob.mutate(
			{
				id: job._id,
				name: title,
				tags: filterEmptyStrings([firstSkill, secondSkill, thirdSkill]),
				category: category.value,
				description,
				deliverables,
				paymentFee: totalValue,
				isPrivate: visibility.value === "private",
				deliveryDate: format(due, "yyyy-MM-dd"),
				meta: {
					coin,
					usdInitialValue: budget,
				},
			},
			{
				onSuccess(_data, { id }) {
					if (talentId && job.escrowPaid) {
						inviteTalent.mutate(
							{
								talentId,
								jobId: id,
							},
							{
								onSuccess() {
									router.push(`/jobs/${id}`);
								},
							}
						);
					} else if (talentId) {
						router.push(`/jobs/${id}/make-deposit/${talentId}`);
					} else {
						router.push(`/jobs/${id}`);
					}
				},
			}
		);
	};

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
		escrowPaid: job.escrowPaid,
	};

	const jobApplicants = job.collections.filter(isJobApplicant);
	const jobApplicantsCount = jobApplicants.length;

	return (
		<div className="flex h-full w-full overflow-y-auto max-sm:flex-col sm:gap-6 sm:pb-10 xl:px-4 2xl:px-8">
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
					}
				}}
				className="flex flex-col bg-white max-sm:mt-[43px] max-sm:flex-1 max-sm:overflow-y-auto sm:h-fit sm:grow sm:rounded-2xl sm:border"
			>
				<div
					className="flex w-full flex-col gap-4 bg-primary-gradient-light px-4 py-6 sm:rounded-t-2xl sm:border-2 sm:border-b-0 sm:p-6 sm:px-5
						sm:pb-8"
				>
					<JobTitle form={form} />

					<div className="flex w-full gap-2 sm:max-w-xl sm:gap-4">
						<JobProposedPrice form={form} amount={amount} coin={c} totalValue={totalValue} rates={rates} />
						<JobDueDate form={form} />
					</div>
				</div>
				<div className="flex w-full grow flex-col gap-6 px-5 py-6 sm:p-6">
					<PreferredSkills form={form} isEdit />
					<JobDescription form={form} />
					<JobDeliverables form={form} isEdit />

					<div className="flex flex-col gap-4">
						<h3 className="text-lg font-medium text-black">Classification</h3>
						<div className="flex items-center gap-4">
							<JobCategory form={form} disabled={talentId !== ""} />
							<JobVisibility form={form} disabled={jobApplicantsCount >= 1 || talentId !== ""} />
						</div>
					</div>
				</div>
			</form>

			<div
				className={cn(
					`max-sm:flex-none max-sm:border-t max-sm:border-[#CCCCCC33] max-sm:bg-white max-sm:px-4 max-sm:py-6 max-sm:pt-4 sm:sticky
					sm:top-0 sm:flex sm:shrink-0 sm:grow-0 sm:basis-[300px] sm:flex-col sm:gap-6`,
					{ "sm:gap-2": talentId && !job.escrowPaid }
				)}
			>
				<Steps jobSteps={jobSteps} isEdit />

				<div className="flex w-full gap-4">
					{!talentId && !job.escrowPaid && (
						<div className="w-full">
							<Button
								variant="primary"
								disabled={
									!jobSteps.details ||
									!jobSteps.skills ||
									!jobSteps.description ||
									!jobSteps.deliverables ||
									!jobSteps.classification ||
									!form.formState.isValid
								}
								onClick={form.handleSubmit(onSubmit)}
								fullWidth
							>
								{updateJob.isLoading ? <Spinner /> : "Update Job"}
							</Button>
						</div>
					)}

					{!talentId && job.escrowPaid && (
						<div className="w-full">
							<Button
								variant="primary"
								onClick={form.handleSubmit(onSubmit)}
								fullWidth
								disabled={
									!jobSteps.details ||
									!jobSteps.skills ||
									!jobSteps.description ||
									!jobSteps.deliverables ||
									!jobSteps.classification ||
									!form.formState.isValid
								}
							>
								{updateJob.isLoading ? <Spinner /> : "Update Job"}
							</Button>
						</div>
					)}

					{talentId && !job.escrowPaid && (
						<div className="w-full">
							<p className="mb-[10px] text-xs text-title sm:mx-auto sm:mb-2 sm:max-w-[248px] sm:text-center sm:text-sm">
								After depositing payment in the <span className="font-bold">Escrow Wallet</span> on the
								next page the talent will automatically be invited.
							</p>

							<Button
								variant="primary"
								onClick={form.handleSubmit(onSubmit)}
								fullWidth
								disabled={
									!jobSteps.details ||
									!jobSteps.skills ||
									!jobSteps.description ||
									!jobSteps.deliverables ||
									!jobSteps.classification ||
									!form.formState.isValid
								}
							>
								{updateJob.isLoading ? <Spinner /> : "Make Deposit"}
							</Button>
						</div>
					)}

					{talentId && job.escrowPaid && (
						<div className="w-full">
							<Button
								variant="primary"
								onClick={form.handleSubmit(onSubmit)}
								fullWidth
								disabled={
									!jobSteps.details ||
									!jobSteps.skills ||
									!jobSteps.description ||
									!jobSteps.deliverables ||
									!jobSteps.classification ||
									!form.formState.isValid
								}
							>
								{inviteTalent.isLoading || updateJob.isLoading ? <Spinner /> : "Invite Talent"}
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
