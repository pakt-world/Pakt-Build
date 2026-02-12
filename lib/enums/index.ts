export enum CollectionTypes {
	JOB = "job",
	COLLECTION = "collection",
	APPLICATION = "application",
	DELIVERABLE = "deliverable",
	CANCEL_REQUEST = "cancel_request", // This is used only for sending cancel request to the other party. and can't be used for checking if a collection is a cancel request. cancel_requested in CollectionStatus covers for that
	REVIEW_CHANGE_REQUEST = "review_change_request",
}

export enum CollectionStatus {
	PENDING = "pending",
	ONGOING = "ongoing",
	WAITING = "waiting",
	PAYMENT_REQUESTED = "payment_requested", // Used when client Finalize Job and want to review, collection status will be set to waiting - Collection status needs to be payment_requested before escrow can be completed
	COMPLETED = "completed",
	CANCEL_REQUESTED = "cancel_requested", // This compliments the cancel_request type in CollectionTypes i.e this would be used in some places instead of cancel_request because ...see CollectionTypes enum for more info & also when a job cancellation request is being sent
	CANCELLED = "cancelled",
}

export enum CollectionInviteStatus {
	PENDING = "pending",
	ACCEPTED = "accepted",
	REJECTED = "rejected",
	CANCELLED = "cancelled",
	ONGOING = "ongoing",
}

export enum PayoutStatus {
	AWAITING = "awaiting",
	PROCESSING = "processing",
	REPROCESSING = "reprocessing",
	COMPLETED = "completed",
	FAILED = "failed",
}
export enum TransactionStatus {
	PROCESSING = "processing",
	PENDING = "pending",
	COMPLETED = "completed",
	FAILED = "failed",
	REPROCESSING = "reprocessing",
}

export enum TransactionType {
	WITHDRAWAL = "withdrawal",
	DEPOSIT = "deposit",
}
export enum CollectionCategory {
	CREATED = "created",
	ASSIGNED = "assigned",
	OPEN = "open",
}

export enum SortApplicationsScoresBy {
	HIGHEST_TO_LOWEST = "highest-to-lowest",
	LOWEST_TO_HIGHEST = "lowest-to-highest",
}

export enum SortApplicationsBy {
	SCORE = "score",
	BID = "bid",
}

export enum Roles {
	EMPTY = "",
	CREATOR = "creator",
	RECIPIENT = "recipient",
}

export enum JobType {
	PRIVATE = "private",
	OPEN = "open",
}

export enum KycVerificationStatus {
	CREATED = "created",
	APPROVED = "approved",
	RESUBMISSION_REQUESTED = "resubmission_requested",
	DECLINED = "declined",
	EXPIRED = "expired",
	ABANDONED = "abandoned",
	SUBMITTED = "submitted",
	MEDIA_UPLOADED = "media_uploaded",
	REVIEW = "review",
	EMPTY = "",
}

export enum JobCategory {
	Design = "design",
	Engineering = "engineering",
	Content = "content",
	Marketing = "marketing",
	Events = "events",
	Others = "others",
}

export enum SocketStatus {
	Offline = "OFFLINE",
	Online = "ONLINE",
}

export enum Bucket {
	ChainsiteStorage = "chainsite-storage",
}

export enum TagType {
	Empty = "",
	Tags = "tags",
}

export enum AchievementType {
	REVIEW = "review",
	REFERRAL = "referral",
	FIVE_STAR = "five-star",
	SQUAD = "squad",
	EMPTY = "",
}

export enum FeedType {
	COLLECTION_CREATED = "collection_created",
	COLLECTION_INVITE = "collection_invite",
	REFERRAL_SIGNUP = "referral_signup",
	REFERRAL_COLLECTION_COMPLETION = "referral_job_completion",
	COLLECTION_UPDATE = "collection_update",
	COLLECTION_DELIVERED = "collection_delivered",
	COLLECTION_COMPLETED = "collection_completed",
	COLLECTION_REVIEWED = "collection_reviewed",
	COLLECTION_CANCELLED = "collection_cancelled",
	COLLECTION_INVITE_FILLED = "collection_invite_filled",
	COLLECTION_INVITE_ACCEPTED = "collection_invite_accepted",
	COLLECTION_INVITE_REJECTED = "collection_invite_rejected",
	COLLECTION_INVITE_CANCELLED = "collection_invite_cancelled",
	ISSUE_RAISED = "issue_resolution_raise",
	JURY_INVITATION = "jury_invitation",
	ISSUE_RESOLUTION_GUILTY = "issue_resolution_guilty",
	ISSUE_RESOLUTION_GUILTY_SECOND = "second_issue_resolution_guilty",
	ISSUE_RESOLUTION_RESOLVED = "issue_resolution_resolve",

	PUBLIC_JOB_CREATED = "public_job_created",
	JOB_APPLICATION_SUBMITTED = "job_application_submitted",
	JOB_INVITATION_RECEIVED = "job_invitation_received",
	PUBLIC_JOB_FILLED = "public_job_filled",
	JOB_DELIVERABLE_UPDATE = "job_deliverable_update",
	JOB_INVITATION_ACCEPTED = "job_invitation_accepted",
	JOB_INVITATION_DECLINED = "job_invitation_declined",
	JOB_COMPLETION = "job_Completion",
	JOB_CANCELLED = "job_cancelled",
	JOB_CANCELLED_REQUEST = "job_cancelled_request",
	JOB_CANCELLED_ACCEPTED = "job_cancelled_accepted",
	JOB_CANCELLED_DECLINED = "job_cancelled_declined",
	JOB_REVIEW = "job_review",
	JOB_REVIEW_CHANGE = "job_review_change",
	JOB_REVIEW_CHANGE_ACCEPTED = "job_review_change_accepted",
	JOB_REVIEW_CHANGE_DECLINED = "job_review_change_declined",
	JOB_PAYMENT_RELEASED = "payment_released",
}

export enum MessageDataTypeEnums {
	DIRECT = "DIRECT",
}

export enum MessageTypeEnums {
	TEXT = "TEXT",
	MEDIA = "MEDIA",
}

export enum ConversationEnums {
	USER_CONNECT = "USER_CONNECT",
	GET_ALL_CONVERSATIONS = "GET_ALL_CONVERSATIONS",
	JOIN_OLD_CONVERSATIONS = "JOIN_OLD_CONVERSATIONS",
	GET_ALL_USERS = "GET_ALL_USERS",
	INITIALIZE_CONVERSATION = "INITIALIZE_CONVERSATION",
	FETCH_CONVERSATION_MESSAGES = "FETCH_CONVERSATION_MESSAGES",
	SEND_MESSAGE = "SEND_MESSAGE",
	// CURRENT_RECIPIENT = "CURRENT_RECIPIENT",
	// USER_TYPING = "USER_TYPING",
	SENDER_IS_TYPING = "SENDER_IS_TYPING",
	SENDER_STOPS_TYPING = "SENDER_STOPS_TYPING",
	POPUP_MESSAGE = "POPUP_MESSAGE",
	MARK_MESSAGE_AS_SEEN = "MARK_MESSAGE_AS_SEEN",
	USER_STATUS = "USER_STATUS",
	// BROADCAST_MESSAGE = "BROADCAST_MESSAGE",
	// DELETE_CONVERSATION = "DELETE_CONVERSATION",
	// DELETE_MESSAGE = "DELETE_MESSAGE",
}

export enum ConversationTypeEnums {
	DIRECT = "DIRECT",
	GROUP = "GROUP",
	ALL = "ALL",
}

export enum MediaEnums {
	IMAGE_PNG = "image/png",
	IMAGE_JPEG = "image/jpeg",
	IMAGE_JPG = "image/jpg",
	IMAGE_GIF = "image/gif",
	IMAGE_SVG = "image/svg",
	PDF = "application/pdf",
	DOC = "application/msword",
	DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	XLS = "application/vnd.ms-excel",
}

export enum TwoFactorAuthEnums {
	AUTHENTICATOR = "google_auth",
	EMAIL = "email",
	SECURITY_QUESTION = "security_answer",
	EMPTY = "",
}

export enum VerifyTypesEnums {
	EMAIL = "email",
	TwoFa = "2fa",
	EMPTY = "",
}

export enum AuthEnums {
	SIGNUP = "signup",
	VERIFY_SIGNUP = "verify_signup",
	VERIFY_SIGNUP_SUCCESS = "signup_success",

	TERMS_AND_CONDITIONS = "terms_and_conditions",
	ONBOARDING = "onboarding",

	LOGIN = "login",
	VERIFY_2FA = "verify_2fa",

	FORGOT_PASSWORD = "forgot_password",
	VERIFY_FORGOT_PASSWORD = "verify_forgot_password",
	FORGOT_PASSWORD_RESET = "password_reset",
	FORGOT_PASSWORD_RESET_SUCCESS = "password_reset_success",

	CHANGE_PASSWORD = "change_password",
}

export enum TelegramBotEvent {
	JOB_POSTED = "job_posted",
}

export enum PaymentMethodType {
	CRYPTO = "crypto",
	STRIPE = "stripe",
}
