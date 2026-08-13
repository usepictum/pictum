import { type PictumAsset, type PlaceholderOptions, placeholder } from "pictum";
import { usePictumOptions } from "../../provider";

export function usePlaceholder(options: PlaceholderOptions): PictumAsset {
	return placeholder({
		...options,
		...usePictumOptions(options),
	} as PlaceholderOptions);
}
