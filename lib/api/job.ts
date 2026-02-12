import { AUTH_TOKEN_KEY, sentenceCase } from "@/lib/utils";
/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type UseMutationResult,
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryResult,
	useInfiniteQuery,
	type UseInfiniteQueryResult,
	type QueryKey,
} from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { toast } from "@/components/common/toaster";
import { type ApiError, type ApiResponse, axios } from "@/lib/axios";
import { useCreateFeed } from "./feed";
import { CollectionProps } from "../types/collection";
import { CollectionCategory, CollectionStatus, CollectionTypes, FeedType, TelegramBotEvent } from "../enums";
import { useTelegramBot } from "./telegram-bot";
import { formatDateHandler } from "../utils";
import { getCookie } from "cookies-next";
// import { useUserState } from "../store/account";

// Attach Deliverables to Job

interface AttachDeliverablesToJobParams {
	jobId: string;
	replace?: boolean;
	deliverables: string[];
}

async function postAttachDeliverablesToJob(params: AttachDeliverablesToJobParams): Promise<unknown> {
	const deliverables = params.deliverables.map((deliverable) => ({
		name: deliverable,
		description: deliverable,
	}));

	const res = await axios.post(`/collection/many`, {
		parent: params.jobId,
		type: CollectionTypes.DELIVERABLE,
		replace: params.replace,
		collections: deliverables,
	});
	return res.data.data;
}

export function useAttachDeliverablesToJob(): UseMutationResult<
	unknown,
	ApiError,
	AttachDeliverablesToJobParams,
	unknown
> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postAttachDeliverablesToJob,
		mutationKey: ["assign-job-deliverables"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Assigning deliverables failed");
		},
		onSuccess: (_, { jobId }) => {
			void queryClient.refetchQueries({
				queryKey: ["get-job-by-id", { jobId }],
			});
		},
	});
}

// Create Job
interface CreateJobParams {
	name: string;
	category: string;
	paymentFee: number;
	description: string;
	isPrivate: boolean;
	deliveryDate: string;
	tags?: string[];
	attachments?: string[];
	deliverables?: string[];
	meta: Record<string, any>;
}

async function postCreateJob(params: CreateJobParams): Promise<CollectionProps> {
	const res = await axios.post("/collection", {
		...params,
		type: CollectionTypes.JOB,
		deliverables: undefined,
	});
	return res.data.data;
}

export function useCreateJob(): UseMutationResult<CollectionProps, ApiError, CreateJobParams, unknown> {
	const assignJobDeliverables = useAttachDeliverablesToJob();
	const createFeed = useCreateFeed();
	const telegramBot = useTelegramBot();

	return useMutation({
		mutationFn: postCreateJob,
		mutationKey: ["create-job"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: async (job, { deliverables = [] }) => {
			const { _id, name, isPrivate, description, creator, meta, deliveryDate, category, tags } = job;
			const telegramPayload = {
				event: TelegramBotEvent.JOB_POSTED,
				data: {
					title: name,
					amount: `$${meta?.usdInitialValue} in ${meta?.coin?.name}`,
					dueDate: formatDateHandler(deliveryDate, "MMM DD, YYYY"),
					category: sentenceCase(category),
					preferredSkills: tags.map((tag) => sentenceCase(tag.name)),
					description: description,
					jobLink: `${window.location.protocol}//${window.location.host}/view-job/${_id}`,
				},
			};
			assignJobDeliverables.mutate({
				jobId: _id,
				deliverables,
			});
			// create feed is isPrivate is false
			if (!isPrivate) {
				createFeed.mutate({
					owners: [creator?._id],
					title: name,
					description,
					data: _id,
					isPublic: true,
					type: FeedType.PUBLIC_JOB_CREATED,
				});
				// Send Telegram notification
				telegramBot.mutate(telegramPayload);
			}
			// toast.success(`Job ${name} posted successfully`);
		},
	});
}

// Get Jobs
interface GetJobsParams {
	page?: number;
	limit?: number;
	category?: CollectionCategory;
	status?: CollectionStatus | CollectionStatus[];
	filter?: Record<string, any>;
	type?: CollectionTypes;
	parent?: string;
	enable?: boolean;
}

export interface GetJobsResponse {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: CollectionProps[];
}

async function getJobs(params: GetJobsParams): Promise<GetJobsResponse> {
	const res = await axios.get("/collection", {
		params: {
			type: params.type ?? CollectionTypes.JOB,
			creator: params.category === CollectionCategory.CREATED ? true : undefined,
			isPrivate: params.category === CollectionCategory.OPEN ? false : undefined,
			receiver: params.category === CollectionCategory.ASSIGNED ? true : undefined,
			status: params.status,
			page: params.page,
			limit: params.limit,
			parent: params.parent,
			...params.filter,
		},
	});
	return res.data.data;
}

async function getActiveJobs(params: GetJobsParams): Promise<GetJobsResponse> {
	const res = await axios.get("/collection", {
		params: {
			type: CollectionTypes.JOB,
			creator: true,
			receiver: true,
			status: params.status,
			page: params.page,
			limit: params.limit,
			parent: params.parent,
			...params.filter,
		},
	});
	return res.data.data;
}

// ========================= Get Jobs ========================= //
export function useGetJobs(params: GetJobsParams): UseQueryResult<GetJobsResponse, ApiError> {
	return useQuery({
		queryFn: () => getJobs(params),
		queryKey: ["get-jobs", params],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		enabled: params.enable,
	});
}

export const useGetJobsInfinitely = (params: GetJobsParams): UseInfiniteQueryResult<GetJobsResponse, ApiError> => {
	const { filter } = params;
	const getQueryKey: QueryKey = ["infinite_jobs", `${JSON.stringify(filter ?? params)}`];

	return useInfiniteQuery(
		getQueryKey,
		async ({ pageParam = 1 }) =>
			await getJobs({
				...params,
				page: pageParam,
			}),
		{
			getNextPageParam: (lastPage) => {
				const { page: p, pages } = lastPage;

				const nextPage = p < pages;

				return nextPage ? p + 1 : undefined;
			},
			enabled: true,
		}
	);
};
export const useGetActiveJobsInfinitely = (
	params: GetJobsParams
): UseInfiniteQueryResult<GetJobsResponse, ApiError> => {
	const { filter } = params;
	const getQueryKey: QueryKey = ["active_infinite_jobs", `${!filter ? "_aj" : `${JSON.stringify(filter)}`}`];

	return useInfiniteQuery(
		getQueryKey,
		async ({ pageParam = 1 }) =>
			await getActiveJobs({
				...params,
				page: pageParam,
			}),
		{
			getNextPageParam: (lastPage) => {
				const { page: p, pages } = lastPage;

				const nextPage = p < pages;

				return nextPage ? p + 1 : undefined;
			},
			enabled: params.enable,
			refetchInterval: 10000,
			cacheTime: 0,
		}
	);
};
// ========================= Get Jobs ========================= //

// ========================= Get Total Job Count ========================= //

export interface GetTotalJobCountResponse {
	count: number;
}
export interface GetTotalJobValueResponse {
	value: number;
}
async function getTotalJobCount(): Promise<GetTotalJobCountResponse> {
	const res = await axios.get(`/collection-public/counts?type=job&escrowPaid=true&isPrivate=true`);
	return res.data.data;
}
async function getTotalJobValue(): Promise<GetTotalJobValueResponse> {
	const res = await axios.get(`/collection-public/values?type=job&escrowPaid=true&isPrivate=true`);
	return res.data.data;
}

export function useGetTotalJobCount(): UseQueryResult<GetTotalJobCountResponse, ApiError> {
	return useQuery({
		queryFn: () => getTotalJobCount(),
		queryKey: ["get-total-job-count"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
export function useGetTotalJobValue(): UseQueryResult<GetTotalJobValueResponse, ApiError> {
	return useQuery({
		queryFn: () => getTotalJobValue(),
		queryKey: ["get-total-job-value"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// ========================= Get Total Job Count ========================= //

// Get Job By Id

interface GetJobByIdParams {
	jobId: string;
}

interface GetJobByIdResponse extends CollectionProps {}

async function getJobById(params: GetJobByIdParams, isLogged: boolean): Promise<GetJobByIdResponse> {
	const res = await axios.get(`/${isLogged ? "collection" : "collection-public"}/${params.jobId}`);
	return res.data.data;
}

export function useGetJobById(params: GetJobByIdParams): UseQueryResult<GetJobByIdResponse, ApiError> {
	const token = getCookie(AUTH_TOKEN_KEY);
	const uQ = useQuery({
		queryFn: async () => {
			if (params.jobId && params.jobId !== "" && params.jobId !== undefined && params.jobId !== null) {
				return getJobById(params, !!token);
			}
			throw new Error("Invalid parameters");
		},
		queryKey: ["get-job-by-id", params],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		refetchInterval: 10000,
		refetchOnWindowFocus: false,
	});

	return uQ;
}

// Update Job
interface UpdateJobParams {
	id: string;
	name: string;
	category: string;
	paymentFee: number;
	description: string;
	tags?: string[];
	isPrivate: boolean;
	deliveryDate: string;
	deliverables: string[];
	attachments?: string[];
	meta?: Record<string, any>;
}

async function postUpdateJob(params: UpdateJobParams): Promise<CollectionProps> {
	const res = await axios.patch(`/collection/${params.id}`, {
		...params,
		type: "job",
		id: undefined,
		deliverables: undefined,
	});
	return res.data.data;
}

export function useUpdateJob(showToast = true): UseMutationResult<CollectionProps, ApiError, UpdateJobParams, unknown> {
	const updateJobDeliverables = useAttachDeliverablesToJob();

	return useMutation({
		mutationFn: postUpdateJob,
		mutationKey: ["update-job"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: async (_, { deliverables = [], id, name }) => {
			updateJobDeliverables.mutate(
				{
					jobId: id,
					deliverables,
					replace: true,
				},
				{
					onError: (error: ApiError) => {
						toast.error(error?.response?.data.message ?? "An error occurred updating deliverables");
					},
				}
			);
			if (showToast) {
				toast.success(`Job ${name} updated successfully`);
			}
		},
	});
}

// Mark Deliverable as Complete
interface MarkDeliverableAsCompleteParams {
	jobId: string;
	jobCreator: string;
	isComplete: boolean;
	deliverableId: string;
	totalDeliverables: number;
	completedDeliverables: number;
	meta: Record<string, any>;
}

async function postToggleDeliverableCompletion(params: MarkDeliverableAsCompleteParams): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.deliverableId}`, {
		progress: params.isComplete ? 100 : 0,
		meta: params.meta,
	});
	return res.data;
}

export function useToggleDeliverableCompletion({
	description,
}: {
	description: string;
}): UseMutationResult<ApiResponse, ApiError, MarkDeliverableAsCompleteParams, unknown> {
	const createFeed = useCreateFeed();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postToggleDeliverableCompletion,
		mutationKey: ["mark-deliverable-as-complete"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Marking deliverable as complete failed");
		},
		onSuccess: async (_, { completedDeliverables, jobId, jobCreator, totalDeliverables, isComplete }) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: [
						"infinite_jobs",
						`${JSON.stringify({ category: CollectionCategory.ASSIGNED, type: CollectionTypes.JOB })}`,
					],
				}),
				queryClient.invalidateQueries({
					queryKey: ["active_infinite_jobs", "_aj"],
				}),
				queryClient.refetchQueries({
					queryKey: ["get-job-by-id", { jobId }],
				}),
			]);
			// if (isComplete) {
			const completedD = isComplete ? completedDeliverables + 1 : completedDeliverables - 1;
			createFeed.mutate({
				type: FeedType.JOB_DELIVERABLE_UPDATE,
				owners: [jobCreator],
				title: "New Job Deliverable Update",
				description,
				data: jobId,
				isPublic: false,
				meta: {
					value: (100 * completedD) / totalDeliverables,
					isMarked: isComplete,
				},
			});
			// }
			// toast.success(`Deliverable marked as ${isComplete ? "complete" : "incomplete"} successfully`);
		},
	});
}

// Update Job Progress
interface UpdateJobProgressParams {
	jobId: string;
	progress: number;
}

async function postUpdateJobProgress(params: UpdateJobProgressParams): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.jobId}`, {
		progress: params.progress,
	});
	return res.data.data;
}

export function useUpdateJobProgress({
	creatorId,
}: {
	creatorId: string;
}): UseMutationResult<ApiResponse, ApiError, UpdateJobProgressParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postUpdateJobProgress,
		mutationKey: ["update-job-progress"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Updating job progress failed");
		},
		onSuccess: async (_, { jobId, progress }) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: [
						"infinite_jobs",
						`${JSON.stringify({ category: CollectionCategory.ASSIGNED, type: CollectionTypes.JOB })}`,
					],
				}),
				queryClient.invalidateQueries({
					queryKey: ["active_infinite_jobs", "_aj"],
				}),
				queryClient.refetchQueries({
					queryKey: ["get-job-by-id", { jobId }],
				}),
			]);
			if (creatorId && progress === 100) {
				createFeed.mutate({
					owners: [creatorId],
					title: "Talent Completed Job",
					description: "Talent Completed Job",
					isPublic: false,
					type: FeedType.JOB_COMPLETION,
					data: jobId,
					meta: {
						progress,
					},
				});
			}
		},
	});
}

// Mark Job as Complete
interface MarkJobAsCompleteParams {
	jobId: string;
	talentId?: string;
	status: CollectionStatus;
}

async function postMarkJobAsComplete(params: MarkJobAsCompleteParams): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.jobId}`, {
		status: params.status,
	});
	return res.data.data;
}

export function useMarkJobAsComplete(): UseMutationResult<ApiResponse, ApiError, MarkJobAsCompleteParams, unknown> {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postMarkJobAsComplete,
		mutationKey: ["mark-job-as-complete"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Marking job as complete failed");
		},
		onSuccess: async (_, { jobId }) => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: [
						"infinite_jobs",
						`${JSON.stringify({ category: CollectionCategory.ASSIGNED, type: CollectionTypes.JOB })}`,
					],
				}),
				queryClient.refetchQueries({
					queryKey: ["get-job-by-id", { jobId }],
				}),
			]);
			await queryClient.refetchQueries(["get-job-by-id", { jobId }]);
			// toast.success("Job marked as completed");
		},
	});
}

// Create Job Review
interface CreateJobReviewParams {
	jobId: string;
	rating: number;
	review: string;
	recipientId: string;
}

async function postCreateJobReview(params: CreateJobReviewParams): Promise<ApiResponse> {
	const res = await axios.post(`/reviews`, {
		review: params.review,
		rating: params.rating,
		collectionId: params.jobId,
		receiver: params.recipientId,
	});
	return res.data.data;
}

export function useCreateJobReview(): UseMutationResult<ApiResponse, ApiError, CreateJobReviewParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: postCreateJobReview,
		mutationKey: ["create-job-review"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (_, { jobId, recipientId, review, rating }) => {
			void queryClient.refetchQueries(["get-job-by-id", { jobId }]);
			createFeed.mutate({
				title: "Job Review",
				description: review,
				isPublic: false,
				data: jobId,
				owners: [recipientId],
				type: FeedType.JOB_REVIEW,
				meta: {
					rating,
				},
			});
			// toast.success("Your review has been submitted successfully");
		},
	});
}

// Release Job Payment
interface ReleaseJobPaymentParams {
	jobId: string;
	amount?: number;
	owner?: string;
}

async function postReleaseJobPayment(params: ReleaseJobPaymentParams): Promise<ApiResponse> {
	const res = await axios.post(`/payment/release`, {
		collection: params.jobId,
		amount: params.amount,
	});
	return res.data.data;
}

export function useReleaseJobPayment(): UseMutationResult<ApiResponse, ApiError, ReleaseJobPaymentParams, unknown> {
	const queryClient = useQueryClient();
	const jobsQuery = useGetJobs({ category: CollectionCategory.ASSIGNED });
	// const createFeed = useCreateFeed();
	// const user = useUserState();

	return useMutation({
		mutationFn: postReleaseJobPayment,
		mutationKey: ["release-job-payment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (_, data) => {
			const { jobId } = data;
			// Logger.info(data);
			void jobsQuery.refetch();
			void queryClient.refetchQueries(["get-job-by-id", { jobId }]);

			// if (owner === user?._id) {
			// 	createFeed.mutate({
			// 		title: "Job Payment",
			// 		description: "Job Payment Released",
			// 		isPublic: false,
			// 		data: jobId,
			// 		owners: [owner],
			// 		type: FeedType.JOB_PAYMENT_RELEASED,
			// 	});
			// }
			// toast.success("Payment released successfully");
		},
	});
}

// Invite talent to a job
interface InviteTalentToJobParams {
	jobId: string;
	talentId: string;
}

async function postInviteTalentToJob(params: InviteTalentToJobParams): Promise<ApiResponse> {
	const res = await axios.post(`/invite`, {
		collection: params.jobId,
		recipient: params.talentId,
	});
	return res.data.data;
}

export function useInviteTalentToJob({
	talentId,
	job,
}: {
	talentId: string;
	job: CollectionProps;
}): UseMutationResult<ApiResponse, ApiError, InviteTalentToJobParams, unknown> {
	const createFeed = useCreateFeed();
	return useMutation({
		mutationFn: postInviteTalentToJob,
		mutationKey: ["invite-talent-to-private-job"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred inviting talent");
		},
		onSuccess: () => {
			if (!job.isPrivate) {
				// create job filled notification for public job applicants
				const applicants = job.collections
					.filter((a) => a.type === "application")
					.map((a) => a.creator._id)
					.filter((a) => a !== talentId);
				if (applicants.length > 0) {
					createFeed.mutate({
						owners: [...applicants],
						title: "Job Filled",
						type: FeedType.PUBLIC_JOB_FILLED,
						data: job._id,
						description: "Job Filled",
						isPublic: false,
					});
				}
			}
			toast.success("Talent invited successfully");
		},
	});
}

// Cancel a job invite

interface CancelJobInviteParams {
	inviteId: string;
}

async function postCancelJobInvite(params: CancelJobInviteParams): Promise<ApiResponse> {
	const res = await axios.post(`/invite/${params.inviteId}/cancel`);
	return res.data.data;
}

export function useCancelJobInvite(): UseMutationResult<ApiResponse, ApiError, CancelJobInviteParams, unknown> {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: postCancelJobInvite,
		mutationKey: ["cancel-job-invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			void queryClient.refetchQueries(["get-job-by-id"]);
			toast.success("Invite cancelled successfully");
		},
	});
}

// Accept a private job invite
interface AcceptPrivateJobInviteParams {
	inviteId: string;
}

async function postAcceptPrivateJobInvite(params: AcceptPrivateJobInviteParams): Promise<ApiResponse> {
	const res = await axios.post(`/invite/${params.inviteId}/accept`);
	return res.data.data;
}

export function useAcceptPrivateJobInvite(): UseMutationResult<
	ApiResponse,
	ApiError,
	AcceptPrivateJobInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postAcceptPrivateJobInvite,
		mutationKey: ["accept-private-job-invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("Invite accepted successfully");
		},
	});
}

// Decline a private job invite
interface DeclinePrivateJobInviteParams {
	inviteId: string;
}

async function postDeclinePrivateJobInvite(params: DeclinePrivateJobInviteParams): Promise<ApiResponse> {
	const res = await axios.post(`/invite/${params.inviteId}/decline`);
	return res.data.data;
}

export function useDeclinePrivateJobInvite(): UseMutationResult<
	ApiResponse,
	ApiError,
	DeclinePrivateJobInviteParams,
	unknown
> {
	return useMutation({
		mutationFn: postDeclinePrivateJobInvite,
		mutationKey: ["decline-private-job-invite"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("Invite declined successfully");
		},
	});
}

// OPEN JOBS

// Apply to an open job

interface ApplyToOpenJobParams {
	jobId: string;
	amount: number;
	message: string;
}

async function postApplyToOpenJob(params: ApplyToOpenJobParams): Promise<CollectionProps> {
	const res = await axios.post(`/collection`, {
		type: "application",
		name: "Application",
		description: params.message,
		parent: params.jobId,
		paymentFee: params.amount,
	});
	return res.data.data;
}

export function useApplyToOpenJob({
	jobCreator,
	// @ts-expect-error --- Unused variable
	jobId,
}: {
	jobCreator: string;
	jobId: string;
}): UseMutationResult<CollectionProps, ApiError, ApplyToOpenJobParams, unknown> {
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: postApplyToOpenJob,
		mutationKey: ["apply-to-open-job"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data) => {
			// create new job application feed for job owner
			createFeed.mutate({
				owners: [jobCreator],
				title: "New Job application",
				description: "New Job application",
				data: data._id,
				isPublic: false,
				type: FeedType.JOB_APPLICATION_SUBMITTED,
			});
		},
	});
}

// Post Job Payment Details

interface PostJobPaymentDetailsParams {
	jobId: string;
	coin: string;
	usdValue: number;
}

export interface PostJobPaymentDetailsResponse {
	rate: number;
	usdFee: number;
	address: string;
	usdAmount: number;
	amountToPay: number;
	expectedFee: number;
	feePercentage: number;
	collectionAmount: number;
	chainId: number;
	paymentMethods: string[];
}

async function postJobPaymentDetails(params: PostJobPaymentDetailsParams): Promise<PostJobPaymentDetailsResponse> {
	const res = await axios.post(`/payment`, {
		usdValue: params.usdValue,
		coin: params.coin,
		collection: params.jobId,
	});
	return res.data.data;
}

export function usePostJobPaymentDetails(): UseMutationResult<
	PostJobPaymentDetailsResponse,
	ApiError,
	PostJobPaymentDetailsParams,
	unknown
> {
	return useMutation({
		mutationFn: postJobPaymentDetails,
		mutationKey: ["get-job-payment-details"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Confirm Job Payment

interface ConfirmJobPaymentParams {
	jobId: string;
	type?: string;
	delay?: number;
}

async function postConfirmJobPayment(params: ConfirmJobPaymentParams): Promise<ApiResponse> {
	await new Promise((resolve): void => {
		setTimeout(resolve, params.delay ?? 0);
	});
	const res = await axios.post(`/payment/validate`, {
		collection: params.jobId,
	});
	return res.data.data;
}

export function useConfirmJobPayment(): UseMutationResult<ApiResponse, ApiError, ConfirmJobPaymentParams, unknown> {
	return useMutation({
		mutationFn: postConfirmJobPayment,
		mutationKey: ["confirm-job-payment"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("Payment confirmed successfully");
		},
	});
}
interface DeleteJobParams {
	id: string;
}

async function postDeleteJob(params: DeleteJobParams): Promise<CollectionProps> {
	const res = await axios.delete(`/collection/${params.id}`);
	return res.data.data;
}

export function useDeleteJob(): UseMutationResult<CollectionProps, ApiError, DeleteJobParams, unknown> {
	return useMutation({
		mutationFn: postDeleteJob,
		mutationKey: ["delete-job"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success(`Job deleted successfully`);
		},
	});
}

// Request Job Cancellation

interface RequestJobCancellationParams {
	type: string;
	jobId: string;
	reason: string;
	explanation?: string;
}

async function requestJobCancellation(params: RequestJobCancellationParams): Promise<ApiResponse> {
	const res = await axios.post(`/collection`, {
		type: params.type,
		name: params.reason,
		parent: params.jobId,
		description: params.explanation,
	});

	return res.data.data;
}

export function useRequestJobCancellation({
	talentId,
}: {
	talentId: string;
}): UseMutationResult<ApiResponse, ApiError, RequestJobCancellationParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: requestJobCancellation,
		mutationKey: ["request-job-cancellation"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Error requesting job cancellation");
		},
		onSuccess: (_, { jobId }) => {
			void queryClient.refetchQueries({
				queryKey: ["get-job-by-id", { jobId }],
			});
			createFeed.mutate({
				title: "Job cancellation request",
				description: "Job cancellation request",
				owners: [talentId],
				data: jobId,
				type: FeedType.JOB_CANCELLED_REQUEST,
				isPublic: false,
			});
			// toast.success(`Job cancellation requested successfully`);
		},
	});
}

// Accept Job Cancellation

interface AcceptJobCancellationParams {
	jobId: string;
	amount: number;
	rating: number;
	review: string;
	recipientId: string;
	status: CollectionStatus;
}

async function acceptJobCancellation(params: AcceptJobCancellationParams): Promise<ApiResponse> {
	let res;

	res = await axios.post(`/reviews`, {
		review: params.review,
		rating: params.rating,
		collectionId: params.jobId,
		receiver: params.recipientId,
	});

	res = await axios.post(`/payment/release`, {
		collection: params.jobId,
		amount: params.amount.toString(),
	});

	res = await axios.patch(`/collection/${params.jobId}`, {
		status: params.status,
	});

	return res.data.data;
}

export function useAcceptJobCancellation(): UseMutationResult<
	ApiResponse,
	ApiError,
	AcceptJobCancellationParams,
	unknown
> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: acceptJobCancellation,
		mutationKey: ["accept-job-cancellation"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Error accepting job cancellation");
		},
		onSuccess: async (_, data) => {
			const { jobId, recipientId, rating, review } = data;
			await Promise.all([
				queryClient.refetchQueries({
					queryKey: ["get-job-by-id", { jobId }],
				}),
				createFeed.mutate({
					title: "Job cancellation accepted.",
					description: "Job cancellation accepted.",
					owners: [recipientId],
					data: jobId,
					type: FeedType.JOB_CANCELLED_ACCEPTED,
					isPublic: false,
					meta: {
						value: rating,
						review,
					},
				}),
			]);
			// toast.success(`Job cancellation accepted successfully`);
		},
	});
}

// Request Review Change

interface RequestReviewChangeParams {
	jobId: string;
	reason: string;
}

async function requestReviewChange(params: RequestReviewChangeParams): Promise<ApiResponse> {
	const res = await axios.post(`/collection`, {
		status: "pending",
		parent: params.jobId,
		description: params.reason,
		type: "review_change_request",
		name: "Review Change Request",
	});

	return res.data.data;
}

export function useRequestReviewChange({
	recipientId,
}: {
	recipientId: string;
}): UseMutationResult<ApiResponse, ApiError, RequestReviewChangeParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: requestReviewChange,
		mutationKey: ["request-review-change"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Error requesting review change");
		},
		onSuccess: async (_, { jobId }) => {
			await queryClient.refetchQueries({
				queryKey: ["get-job-by-id", { jobId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Request Review Change",
				description: "New Review Change Request",
				owners: [recipientId],
				data: jobId,
				type: FeedType.JOB_REVIEW_CHANGE,
				isPublic: false,
			});
			// toast.success(`Review change requested successfully`);
		},
	});
}

// Accept Review Change: client review is deleted, all deliverables status as 0;
interface AcceptReviewChangeParams {
	jobId: string;
	reviewId: string;
	requestId: string;
	deliverableIds: string[];
}

// this basically deletes the review, sets all deliverables to 0, sets the review request to completed and the job to ongoing
async function acceptReviewChange(params: AcceptReviewChangeParams): Promise<ApiResponse> {
	let res;

	res = await axios.delete(`/reviews/${params.reviewId}`);

	res = await axios.patch(`/collection/many/update`, {
		collections: params.deliverableIds.map((id) => ({
			id,
			progress: 0,
		})),
	});

	res = await axios.patch(`/collection/${params.requestId}`, {
		status: "completed",
	});

	res = await axios.patch(`/collection/${params.jobId}`, {
		status: "ongoing",
	});

	return res.data.data;
}

export function useAcceptReviewChange({
	jobId,
	recipientId,
}: {
	jobId: string;
	recipientId: string;
}): UseMutationResult<ApiResponse, ApiError, AcceptReviewChangeParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: acceptReviewChange,
		mutationKey: ["accept-review-change"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Error accepting review change");
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["get-job-by-id", { jobId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Review Change Accepted",
				description: "New Review Change Request Accepted",
				owners: [recipientId],
				data: jobId,
				type: FeedType.JOB_REVIEW_CHANGE_ACCEPTED,
				isPublic: false,
			});
			// toast.success(`Review change accepted successfully`);
		},
	});
}

// Decline Review Change: review_request status is set to cancelled,

interface DeclineReviewChangeParams {
	reviewChangeRequestId: string;
}

async function declineReviewChange(params: DeclineReviewChangeParams): Promise<ApiResponse> {
	const res = await axios.patch(`/collection/${params.reviewChangeRequestId}`, {
		status: "completed",
	});

	return res.data.data;
}

export function useDeclineReviewChange({
	jobId,
	recipientId,
}: {
	jobId: string;
	recipientId: string;
}): UseMutationResult<ApiResponse, ApiError, DeclineReviewChangeParams, unknown> {
	const queryClient = useQueryClient();
	const createFeed = useCreateFeed();

	return useMutation({
		mutationFn: declineReviewChange,
		mutationKey: ["decline-review-change"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "Error declining review change");
		},
		onSuccess: async () => {
			await queryClient.refetchQueries({
				queryKey: ["get-job-by-id", { jobId }],
			});
			// create feeds
			createFeed.mutate({
				title: "Review Change Accepted",
				description: "New Review Change Request Accepted",
				owners: [recipientId],
				data: jobId,
				type: FeedType.JOB_REVIEW_CHANGE_ACCEPTED,
				isPublic: false,
			});
			// toast.success(`Review change declined successfully`);
		},
	});
}
