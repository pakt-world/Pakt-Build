"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import dayjs from "dayjs";
import { DownloadIcon, Loader } from "lucide-react";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { formatBytes, getPreviewByType2 } from "@/lib/utils";
import { useDownloadAttachment } from "@/lib/api/upload";
import { CombinedAttachmentType } from "@/providers/socket-types";

const MAX_LEN = 15;

const SingleAttachmentView = ({ img }: { img: CombinedAttachmentType }): JSX.Element => {
	const downloadAttachments = useDownloadAttachment();
	const DownloadAttachment = (url: string): void => {
		downloadAttachments.mutate(url);
	};

	return (
		<div className="flex h-fit w-fit gap-2 rounded-lg bg-[#F7F9FA] p-4">
			<div className="flex w-10 flex-col items-center">
				<Image
					className="min-h-[38px] min-w-[38px] rounded-lg"
					src={(img?.type ?? "") && getPreviewByType2(img.type ?? "").preview}
					alt="upload-picture"
					width={38}
					height={38}
					objectFit="contain"
				/>
			</div>
			<div className="flex flex-1 flex-col sm:w-64">
				<p className="text-sm text-title">
					{(img?.name ?? "").length > MAX_LEN ? `${(img?.name ?? "").slice(0, MAX_LEN)}...` : img?.name}
				</p>
				<p className="flex items-center text-sm text-body">
					<span>{img?.uploadProgress ? img?.size : formatBytes(Number(img?.size), 0)}</span>
				</p>
			</div>
			<div className="flex w-16 flex-col items-end justify-between">
				<div className="flex w-fit">
					{(img?.file ?? downloadAttachments.isLoading) ? (
						<Loader size={20} className="animate-spin text-primary" />
					) : (
						<DownloadIcon
							size={20}
							className="cursor-pointer text-primary"
							onClick={() => {
								DownloadAttachment(img?._id ?? "");
							}}
						/>
					)}
				</div>
				<p className="flex items-center text-xs text-body">
					{img?.file ? `${img.uploadProgress ?? 0}%` : dayjs(img?.createdAt).format("HH:mm A")}{" "}
				</p>
			</div>
		</div>
	);
};

export const RenderAttachmentViewer = ({
	images = [],
	align,
	timestamp,
}: {
	images: CombinedAttachmentType[];
	align?: "left" | "right";
	timestamp?: string;
}): JSX.Element => {
	// Attach timestamp to relative images
	let updatedImages = images;
	if (timestamp) {
		updatedImages = images.map((img) => ({
			...img,
			createdAt: timestamp,
		}));
	}
	return (
		<div className={`flex w-fit flex-col gap-2 ${align === "left" ? "ml-auto" : "mr-auto"}`}>
			{updatedImages?.map((img, i) => <SingleAttachmentView key={i} img={img} />)}
		</div>
	);
};
