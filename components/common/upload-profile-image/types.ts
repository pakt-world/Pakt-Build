/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type DropzoneInputProps, type DropzoneRootProps } from "react-dropzone";
import { type UseMutationResult } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError } from "@/lib/axios";
import { type UpdateAccountParams } from "@/lib/api/account";
import { type UploadImageParams, type UploadImageResponse } from "@/lib/api/upload";
import { AccountProps } from "@/lib/types/account";

export interface UPIProps {
	getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
	getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
	imageFile: {
		file: File;
		preview: string;
	} | null;
	isFileTooLarge: boolean;
	isDragReject: boolean;
	uploadImage: UseMutationResult<UploadImageResponse, ApiError, UploadImageParams, unknown>;
	updateAccount: UseMutationResult<AccountProps, ApiError, UpdateAccountParams, unknown>;
	handleUpload: () => void;
	uploadProgress: number;
	goToPreviousSlide?: (() => void) | undefined;
	isOnboarding?: boolean;
	uploaded?: boolean;
	continueToDashboard?: () => void;
	open?: () => void;
}
