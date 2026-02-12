"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type * as z from "zod";
import { type SubmitHandler, type UseFormReturn } from "react-hook-form";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCreateJob } from "@/lib/api/job";
import { Spinner } from "@/components/common/loader";
import { baseCreateJobSchema } from "@/lib/validations";
import JobDescription from "./description";
import JobDeliverables from "./deliverables";
import JobVisibility from "./visibility";
import JobCategory from "./category";
import PreferredSkills from "./preferred-skills";
import JobTitle from "./title";
import JobDueDate from "./due-date";
import JobProposedPrice from "./payment-fee";
import { useExchangeRateStore } from "@/lib/store/misc";
import { Button } from "@/components/common/button";
import { useUserState } from "@/lib/store/account";
import { JOB_DIGIT, roundDown } from "@/lib/utils";

type FormValues = z.infer<typeof baseCreateJobSchema>;

interface CreateJobFormProps {
	form: UseFormReturn<FormValues>;
	jobSteps: {
		details: boolean;
		skills: boolean;
		description: boolean;
		deliverables: boolean;
		classification: boolean;
	};
}

const CreateJobForm = ({ form, jobSteps }: CreateJobFormProps): ReactElement => {
	const router = useRouter();
	const createJob = useCreateJob();
	const { data: rates } = useExchangeRateStore();

	const { user } = useUserState();
	const { firstName } = user ?? { firstName: "" };

	const amount = form.watch("budget");
	const c = form.watch("coin");
	const coinRate = c?.reference && rates?.[c.reference] !== undefined ? rates[c.reference] : 0;
	const totalValue = roundDown(String(coinRate && amount / coinRate), JOB_DIGIT);

	const onSubmit: SubmitHandler<FormValues> = ({
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
		createJob.mutate(
			{
				name: title,
				tags: [firstSkill, secondSkill, thirdSkill].filter(Boolean),
				category: category.value,
				description,
				deliverables,
				paymentFee: totalValue,
				isPrivate: visibility.value === "private",
				deliveryDate: format(due, "yyyy-MM-dd"),
				meta: {
					coin,
					firstName: firstName,
					usdInitialValue: budget,
				},
			},
			{
				onSuccess: ({ _id }) => {
					router.push(`/jobs/${_id}`);
					// router.refresh();
				},
			}
		);
	};

	// Check through each form fields one b to see if they are valid
	const disableButton =
		!jobSteps.details ||
		!jobSteps.skills ||
		!jobSteps.description ||
		!jobSteps.deliverables ||
		!jobSteps.classification;

	return (
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
			<div className="flex w-full flex-col gap-6 px-5 py-6 sm:grow sm:p-6">
				<PreferredSkills form={form} />
				<JobDescription form={form} />
				<JobDeliverables form={form} />
				<div className="flex flex-col gap-4">
					<h3 className="text-lg font-medium text-black">Classifications</h3>
					<div className="flex w-full flex-col items-center gap-4 sm:flex-row">
						<div className="flex w-full items-center gap-4">
							<JobCategory form={form} />
							<JobVisibility form={form} />
						</div>

						<Button
							disabled={createJob.isLoading || !form.formState.isValid || disableButton}
							fullWidth
							className="mt-auto sm:ml-auto sm:max-w-[250px]"
							size="lg"
							variant="primary"
						>
							{createJob.isLoading ? <Spinner /> : "Post Job"}
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
};

export default CreateJobForm;
