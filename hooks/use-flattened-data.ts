import { ApiError } from "@/lib/axios";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

interface Identifiable {
	_id: string;
}

type Page<T> = {
	limit: number;
	page: number;
	pages: number;
	total: number;
	data: T[];
};

// TODO: Hook needs improvements
/**
 * A custom hook that flattens a nested data structure and provides utility functions.
 *
 * @param initialData - The initial nested data structure
 * @returns An object containing the flattened data and utility functions
 */
export const useFlattenedData = <T extends Identifiable>(initialData: UseInfiniteQueryResult<Page<T>, ApiError>) => {
	const [flattenedData, setFlattenedData] = useState<T[]>([]);

	useEffect(() => {
		if (initialData.data) {
			const flattened = initialData.data.pages.flatMap((page) => page.data);
			setFlattenedData(flattened);
		}
	}, [initialData.data]);

	/**
	 * Get all _id values from the flattened data.
	 *
	 * @returns An array of all _id values
	 */
	// Memoize derived values to avoid unnecessary recalculations
	const allIds = useMemo(() => flattenedData.map((item) => item._id), [flattenedData]);

	/**
	 * Get the total count of items in the flattened data.
	 *
	 * @returns The total number of items
	 */
	const totalCount = useMemo(() => flattenedData.length, [flattenedData]);

	/**
	 * Filter the flattened data based on a predicate function.
	 *
	 * @param predicate - A function that defines the filter condition
	 * @returns An array of filtered items
	 */
	const filterData = (predicate: (item: T) => boolean): T[] => {
		return flattenedData.filter(predicate);
	};

	return {
		flattenedData,
		allIds,
		totalCount,
		filterData,
	};
};
