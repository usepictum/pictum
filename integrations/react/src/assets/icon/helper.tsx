import { type IconOptions, icon, type PictumAsset } from "pictum";
import { usePictumOptions } from "../../provider";

export function useIcon(name: string, options: IconOptions = {}): PictumAsset {
	return icon(name, usePictumOptions(options));
}
