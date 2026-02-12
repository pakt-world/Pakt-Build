"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getCookie } from "cookies-next";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useUpdateAccount } from "@/lib/api/account";
import { toast } from "@/components/common/toaster";
import { useUploadImage } from "@/lib/api/upload";
import { DesktopUploadProfileImage } from "./screens/desktop";
import { MobileProfileImage } from "./screens/mobile";
import { AUTH_TOKEN_KEY } from "@/lib/utils";
import { useSetToken } from "@/hooks/use-set-token";
import { useUserState } from "@/lib/store/account";
import { useOnboardingActionState } from "@/lib/store/onboarding";
import { BrandLoader } from "../brand-loader";
import { REDIRECT_STORAGE_KEY } from "@/hooks/use-view-mode-redirect";
import { SlideItemProps } from "../slider";

const MB_IN_BYTES = 1024 * 1024;
const maxSize = 2 * MB_IN_BYTES;

interface Props {
	isOnboarding?: boolean;
	miscAction?: () => void;
	previewImage?: {
		file: File;
		preview: string;
	} | null;
}

export function UploadProfileImage({ isOnboarding, miscAction, previewImage }: Props & SlideItemProps): JSX.Element {
	const isTab = useMediaQuery("(min-width: 640px)");
	const token = getCookie(AUTH_TOKEN_KEY);
	const router = useRouter();

	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploaded, setUploaded] = useState(false);
	const [isTokenSet, setIsTokenSet] = useState(false);

	const { setShowOnboardingDialog } = useOnboardingActionState();

	const uploadImage = useUploadImage();

	const { user } = useUserState();
	const { profileImage } = user ?? { profileImage: null };

	const updateAccount = useUpdateAccount();

	const [imageFile, setImageFile] = useState<{
		file: File;
		preview: string;
	} | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		// if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0] as File;
		setImageFile({
			file,
			preview: URL.createObjectURL(file),
		});
	}, []);

	useEffect(() => {
		if (previewImage) {
			setImageFile(previewImage);
		}
	}, [previewImage]);

	const { getRootProps, getInputProps, fileRejections, isDragReject, open } = useDropzone({
		onDrop,
		maxSize,
		minSize: 0,
		maxFiles: 1,
		accept: {
			"image/png": [],
			"image/jpeg": [],
			"image/jpg": [],
		},
		// noClick: true, // Prevent default root click but allow manual input click
		// noKeyboard: true, // Disables keyboard input for the dropzone
	});

	const isFileTooLarge =
		fileRejections.length > 0 && fileRejections[0]?.file?.size != null && fileRejections[0].file.size > maxSize;

	useEffect(() => {
		return () => {
			if (imageFile != null) {
				URL.revokeObjectURL(imageFile.preview);
			}
		};
	}, [imageFile]);

	const handleUpload = (): void => {
		if (imageFile == null) return;
		uploadImage.mutate(
			{ file: imageFile.file, onProgress: setUploadProgress },
			{
				onSuccess: (data) => {
					// save account details
					const payload = isOnboarding
						? {
								profile: { bio: { title: "Pakt Builder" } },
								profileImage: data._id,
								meta: { onboarding: true, acceptedTerms: true },
							}
						: { profileImage: data._id };
					updateAccount.mutate(payload, {
						onSuccess: () => {
							if (!isOnboarding) toast.success("Image uploaded successfully");
							if (miscAction) miscAction();
							if (isOnboarding) {
								setUploaded(true);
							}
						},
					});
				},
			}
		);
	};
	// Get the last viewed job ID from localStorage
	const redirectPath = localStorage.getItem(REDIRECT_STORAGE_KEY);

	useEffect(() => {
		if (isTokenSet && profileImage?.url) {
			// router.push("/dashboard");
			if (redirectPath) {
				router.push(redirectPath);
				localStorage.removeItem(REDIRECT_STORAGE_KEY);
			} else {
				router.push("/dashboard"); // Default redirect if no job was saved
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTokenSet, profileImage?.url]);

	useSetToken({ token, setIsTokenSet });

	if (!isTokenSet) {
		return <BrandLoader />;
	}

	return (
		<>
			{isTab ? (
				<DesktopUploadProfileImage
					handleUpload={handleUpload}
					isFileTooLarge={isFileTooLarge}
					getRootProps={getRootProps}
					getInputProps={getInputProps}
					imageFile={imageFile}
					isDragReject={isDragReject}
					uploadImage={uploadImage}
					updateAccount={updateAccount}
					uploadProgress={uploadProgress}
					isOnboarding={isOnboarding}
					uploaded={uploaded}
					continueToDashboard={() => {
						router.push("/dashboard");
						setShowOnboardingDialog(false);
					}}
					open={open}
				/>
			) : (
				<MobileProfileImage
					handleUpload={handleUpload}
					isFileTooLarge={isFileTooLarge}
					getRootProps={getRootProps}
					getInputProps={getInputProps}
					imageFile={imageFile}
					isDragReject={isDragReject}
					uploadImage={uploadImage}
					updateAccount={updateAccount}
					uploadProgress={uploadProgress}
					isOnboarding={isOnboarding}
					continueToDashboard={() => {
						router.push("/dashboard");
					}}
					uploaded={uploaded}
					open={open}
				/>
			)}
		</>
	);
}
