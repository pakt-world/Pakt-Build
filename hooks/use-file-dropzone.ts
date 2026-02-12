"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useCallback, useState } from "react";
import type { DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { toast } from "@/components/common/toaster";
import { formatBytes, getPreviewByType } from "@/lib/utils";
import type { AttachmentsSendingProps } from "@/providers/socket-types";
import { useSettingState } from "@/lib/store/settings";

export const ACCEPTED_FILE_TYPES = {
	"image/*": [],
	"application/pdf": [".pdf"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
	"text/*": [".csv"],
	"application/vnd.ms-excel": [".csv"],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
	"image/avif": [".avif"],
	"image/webp": [".webp"],
};

const useFileDropzone = (options: Partial<DropzoneOptions> = {}) => {
	const [imageFiles, setImageFiles] = useState<AttachmentsSendingProps[] | []>([]);
	const { settings } = useSettingState();

	const MAX_SIZE = Number(settings?.maximum_upload_size_site) ?? 10097152;

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		try {
			const files = acceptedFiles.map((f, i) => ({
				file: f,
				preview: getPreviewByType(f).preview,
				type: getPreviewByType(f).type,
				_id: String(i),
				name: f.name,
				size: formatBytes(f.size, 0),
			}));
			setImageFiles(files);
		} catch (error) {
			toast.error("An unexpected error occurred while processing files. Please try again");
		}
	}, []);

	const onDropError = useCallback((rejectedFiles: FileRejection[]) => {
		try {
			rejectedFiles.forEach((rejected) => {
				if (rejected.errors[0]?.code === "file-too-large") {
					toast.error(`File "${rejected.file.name}" is too large. Max size is 2MB`);
				} else {
					toast.error(rejected.errors[0]?.message || "Error uploading file");
				}
			});
		} catch (error) {
			toast.error("An unexpected error occurred while handling rejected files.");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const dropzoneProps = useDropzone({
		onDrop,
		onDropRejected: onDropError,
		// maxSize: 5242880, // 5MB
		maxSize: MAX_SIZE, // 2MB
		maxFiles: 5,
		accept: ACCEPTED_FILE_TYPES,
		noClick: true,
		...options,
	});

	const removeImg = (id: string): void => {
		try {
			const newImages = imageFiles.filter((f) => f._id !== id);
			setImageFiles(newImages);
		} catch (error) {
			toast.error("An error occurred while removing the file.");
		}
	};

	return {
		imageFiles,
		setImageFiles,
		removeImg,
		...dropzoneProps,
	};
};

export default useFileDropzone;
