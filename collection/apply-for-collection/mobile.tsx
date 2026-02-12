"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import React, { type FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { useApplyToOpenJob, useGetJobById } from "@/lib/api/job";
import Lottie from "@/components/common/lottie";
import success from "@/lottiefiles/success.json";
import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "@/components/common/button";
import { MobileBreadcrumb } from "@/components/common/mobile-breadcrumb";

const jobApplicationSchema = z.object({
	message: z.string().nonempty("Message is required"),
	amount: z.coerce.number().min(10, { message: "Amount must be at least $10" }).nonnegative(),
});

type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;

interface TalentJobApplyModalProps {
	jobId: string;
}

export const Apply4JobMobile: FC<TalentJobApplyModalProps> = ({ jobId }) => {
	const router = useRouter();
	const jobQuery = useGetJobById({ jobId });

	const { data: job } = jobQuery;
	const jobCreator = job?.creator._id ?? "";

	const applyToOpenJob = useApplyToOpenJob({ jobCreator, jobId });
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const form = useForm<JobApplicationFormValues>({
		resolver: zodResolver(jobApplicationSchema),
		defaultValues: {
			message: "",
		},
	});

	const onSubmit: SubmitHandler<JobApplicationFormValues> = ({ amount, message = "" }) => {
		applyToOpenJob.mutate(
			{
				jobId,
				amount,
				message,
			},
			{
				onSuccess: () => {
					setShowSuccessMessage(true);
					void jobQuery.refetch();
				},
			}
		);
	};

	if (showSuccessMessage) {
		return (
			<div className="fixed top-[70px] flex size-full h-[calc(100dvh-134px)] max-w-xl flex-col justify-center gap-4 bg-white p-6">
				<div className="flex flex-col items-center justify-center gap-1">
					<div className="-mt-[4] max-w-[200px]">
						<Lottie animationData={success} loop={false} />
					</div>

					<h2 className="text-2xl font-medium">Application Sent</h2>
					<span className="text-center text-body">
						You will get a notification if the client sends you a message
					</span>
					<Button
						variant="primary"
						size="md"
						className="mt-4"
						fullWidth
						onClick={() => {
							router.push(`/dashboard`);
						}}
					>
						Done
					</Button>
				</div>
			</div>
		);
	}
	return (
		<>
			<MobileBreadcrumb
				items={[
					{
						label: "Jobs",
						link: "/jobs?job-type=open",
					},
					{ label: "Job Details", link: `/jobs/${jobId}` },
					{ label: "Apply", active: true },
				]}
				className="!fixed top-[70px] !bg-[#0E1319]"
			/>

			<form
				className="fixed top-[111px] flex h-[calc(100dvh-177px)] w-full flex-col items-center gap-2 px-6 py-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex flex-col items-center gap-1">
					<h2 className="text-2xl font-bold text-title">Propose Price</h2>
				</div>
				<div className="flex w-full flex-col gap-2">
					<label htmlFor="due" className="text-title">
						Enter Bid
					</label>

					<div
						className="hover:duration-200h-[45px] flex items-center gap-2 rounded-lg border border-line bg-input-bg px-4 py-3 outline-none
							focus-within:border-line hover:border-line"
					>
						{/* <DollarIcon /> */}
						<span className="text-body">$</span>
						<NumericInput
							type="text"
							{...form.register("amount")}
							placeholder="e.g 1000"
							className="h-full bg-transparent text-sm text-body focus:outline-none"
						/>
					</div>

					{form.formState.errors.amount != null && (
						<span className="text-sm text-red-500">{form.formState.errors.amount.message}</span>
					)}
				</div>
				<div className="flex w-full flex-col gap-2">
					<label htmlFor="due" className="text-title">
						Message
					</label>
					<textarea
						rows={3}
						maxLength={150}
						id="due"
						{...form.register("message")}
						placeholder="Describe why you're a good candidate"
						className="w-full resize-none rounded-lg border border-line bg-input-bg px-4 py-3 outline-none focus-within:border-line
							hover:border-line hover:duration-200"
					/>
					<div className="-mt-1 ml-auto w-fit text-sm text-body">{form.watch("message")?.length}/150</div>

					{form.formState.errors.message != null && (
						<span className="text-sm text-red-500">{form.formState.errors.message.message}</span>
					)}
				</div>

				<Button variant="primary" size="md" fullWidth disabled={applyToOpenJob.isLoading} className="mt-auto">
					{applyToOpenJob.isLoading ? <Spinner /> : "Send Application"}
				</Button>
			</form>
		</>
	);
};
