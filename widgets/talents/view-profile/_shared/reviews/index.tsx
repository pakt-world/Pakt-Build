"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ReactElement } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Spinner } from "@/components/common/loader";
import { BlazeCarousel, useBlazeSlider } from "@/components/common/blazeCarousel";
import { type ReviewProps } from "./types";
import { Review } from "./item";

export const Reviews = ({ reviews, loading }: { reviews: ReviewProps[]; loading: boolean }): ReactElement => {
	const tab = useMediaQuery("(min-width: 640px)");
	const sliderInstance = useBlazeSlider();

	const { currentSlide } = sliderInstance;
	const { totalSlides } = sliderInstance;

	return (
		<div className="w-full basis-0 gap-1 border border-[#CDCFD099] bg-[#F9F9FB] p-6 sm:rounded-2xl">
			<div className="mb-4 flex w-full flex-row justify-between">
				<h3 className="text-lg font-medium text-title sm:text-2xl">Reviews</h3>
				<div className="flex flex-row gap-2">
					<ArrowLeftCircle
						size={32}
						className={`cursor-pointer text-body opacity-100 ${currentSlide === 0 && "opacity-20"}`}
						onClick={() => {
							sliderInstance.nextSlide();
						}}
					/>
					<ArrowRightCircle
						size={32}
						className={`cursor-pointer text-body opacity-100 ${currentSlide === totalSlides && "opacity-20"}`}
						onClick={() => {
							sliderInstance.prevSlide();
						}}
					/>
				</div>
			</div>

			{loading ? (
				<div className="z-20 my-auto flex min-h-[307px] w-full items-center justify-center text-title">
					<Spinner />
				</div>
			) : (
				<div className="relative h-full basis-0">
					<BlazeCarousel elRef={sliderInstance?.ref}>
						{reviews &&
							reviews.length > 0 &&
							reviews.map((_review, i) => (
								<Review
									key={i}
									title={_review.title}
									body={_review.body}
									rating={_review.rating}
									user={_review.user}
									date={_review.date}
									index={
										reviews.length - i < 10
											? `0${reviews.length - i}`
											: (reviews.length - i).toString()
									}
									tab={tab}
								/>
							))}
					</BlazeCarousel>

					{!reviews ||
						(reviews.length === 0 && (
							<div className="m-auto flex min-h-[207px] w-full items-center text-title">
								<p className="mx-auto">No Reviews</p>
							</div>
						))}
				</div>
			)}
		</div>
	);
};
