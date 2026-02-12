import { KycVerificationStatus } from "../enums";

export const kycIsPending = (kyc: boolean, kycStatus: KycVerificationStatus): boolean => {
	return !kyc && (kycStatus === KycVerificationStatus.REVIEW || kycStatus === KycVerificationStatus.SUBMITTED);
};
