"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Image from "next/image";
import { Edit3, AlertCircle } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Button } from "@/components/common/button";
import { GallerySvg } from "@/components/common/gallery-svg";
import { FloatingAvatars } from "../misc/floating-avatars";
import { type UPIProps } from "../types";
import { UploadProgress } from "../misc/upload-progress";

export function MobileProfileImage({
	isOnboarding,
	getRootProps,
	getInputProps,
	imageFile,
	isFileTooLarge,
	isDragReject,
	uploadImage,
	updateAccount,
	handleUpload,
	uploadProgress,
	uploaded,
	continueToDashboard,
	open,
}: UPIProps): JSX.Element {
	return (
		<div className="relative flex h-[calc(100vh-70px)] w-full flex-col items-center gap-4 overflow-y-auto py-4 sm:hidden">
			{isOnboarding && (
				<div className="relative flex w-full flex-none items-center justify-center">
					<span className="text-xl font-bold text-title">{uploaded ? "Success!" : "Create Your Avatar"}</span>
				</div>
			)}

			<div className="relative flex w-full flex-1 flex-col items-center justify-start gap-4 overflow-y-auto rounded-2xl">
				<div
					className="relative flex min-h-[450px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl bg-white
						sm:hidden"
				>
					<FloatingAvatars />

					<div
						className="group flex size-[225px] cursor-pointer items-center justify-center overflow-hidden rounded-full border
							bg-green-lighter/20 duration-200 hover:bg-blue-lighter/50"
						{...getRootProps()}
					>
						<input {...getInputProps()} />
						<div className="relative flex size-full cursor-pointer items-center justify-center">
							<div className="flex flex-col items-center gap-2 text-center">
								<GallerySvg />
								<span className="flex flex-col gap-1 text-title">Tap to upload</span>
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								{imageFile != null && (
									<Image
										src={imageFile.preview}
										alt="profile picture"
										layout="fill"
										objectFit="cover"
									/>
								)}
							</div>
						</div>
					</div>
					{imageFile == null && (
						<span className="flex flex-col gap-1 text-center italic text-body">
							Supported file types: JPG, JPEG and PNG 2MB size limit
						</span>
					)}
					{isFileTooLarge && (
						<div className="flex items-center gap-1 text-sm text-red-500">
							<AlertCircle size={16} />
							<span>File size should be less than 2MB</span>
						</div>
					)}

					{isDragReject && (
						<div className="flex items-center gap-1 text-sm text-red-500">
							<AlertCircle size={16} />
							<span>File type not supported</span>
						</div>
					)}
					{imageFile != null && (
						<Button
							className=""
							variant="outlinePrimary"
							onClick={() => {
								open?.();
							}}
						>
							<Edit3 size={24} />
							<span className="text-sm">Edit Image</span>
						</Button>
					)}

					{uploadImage.isLoading || updateAccount.isLoading ? (
						<div className="z-20 w-full max-w-[300px]">
							<UploadProgress progress={uploadProgress} />
						</div>
					) : uploaded ? (
						<div className="w-full max-w-xs">
							<Button size="lg" fullWidth onClick={continueToDashboard} variant="primary">
								Continue
							</Button>
						</div>
					) : (
						imageFile != null && (
							<div className="w-full max-w-xs">
								<Button
									size="lg"
									fullWidth
									disabled={imageFile == null || isFileTooLarge}
									onClick={handleUpload}
									variant="primary"
								>
									Upload Image
								</Button>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}
