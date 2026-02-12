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

export function DesktopUploadProfileImage({
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
		<div className="relative z-10 hidden w-full shrink-0 flex-col items-center gap-4 sm:flex">
			<FloatingAvatars />

			<div className="relative w-full">
				{/* <Button
					className="!absolute -top-4 left-0 w-[148px] !border-primary !text-lg !font-normal text-primary hover:bg-lime-50
						hover:!text-primary"
					type="button"
					size="sm"
					onClick={goToPreviousSlide}
					variant="outlinePrimary"
				>
					<ArrowLeft />
					Go Back
				</Button> */}
				{isOnboarding && (
					<div className="flex flex-col items-center text-body">
						{/* <p className="text-lg">Last Step</p> */}
						<span className="text-2xl font-bold text-title">Create Your Avatar</span>
						<span className="text-lg leading-[27px] tracking-wide text-title">
							Upload an image for your avatar
						</span>
					</div>
				)}
				{/* <Button
					className="!absolute -top-4 right-0 w-[148px] !border-primary !text-lg !font-bold text-primary hover:bg-lime-50 hover:!text-primary"
					type="button"
					size="sm"
					onClick={() => {
						router.push("/dashboard");
					}}
					variant="outlinePrimary"
				>
					Skip
				</Button> */}
			</div>

			<div
				className="group relative flex h-[270px] w-[270px] cursor-pointer items-center justify-center overflow-hidden rounded-full border
					border-[#7DDE86] bg-[#F9FFF7] duration-200 hover:bg-secondary/50"
				{...getRootProps()}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center gap-2 text-center">
					<GallerySvg />
					<span className="flex flex-wrap gap-1 text-body">
						<span className="text-body">Click</span>
						<span> to upload</span>
					</span>
				</div>

				<div className="absolute inset-0 flex items-center justify-center">
					{imageFile != null && (
						<Image src={imageFile.preview} alt="profile picture" layout="fill" objectFit="cover" />
					)}
				</div>
			</div>

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
			<div className="flex w-full flex-col items-center justify-center gap-4">
				{imageFile != null && (
					<div className="flex items-center justify-center">
						<Button
							className="mt-10"
							variant="outlinePrimary"
							onClick={() => {
								open?.();
							}}
						>
							<Edit3 size={24} />
							<span className="text-sm">Change Image</span>
						</Button>
					</div>
				)}
				{uploadImage.isLoading || updateAccount.isLoading ? (
					<UploadProgress progress={uploadProgress} />
				) : uploaded ? (
					<div className="w-full max-w-xs">
						<Button size="lg" fullWidth onClick={continueToDashboard} variant="primary">
							Continue
						</Button>
					</div>
				) : (
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
				)}
			</div>
		</div>
	);
}
