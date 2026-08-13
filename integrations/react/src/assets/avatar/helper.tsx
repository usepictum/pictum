import { type AvatarOptions, avatar, type PictumAsset } from "pictum";
import { usePictumOptions } from "../../provider";

export function useAvatar(
	seed: string,
	options: AvatarOptions = {},
): PictumAsset {
	return avatar(seed, {
		...options,
		...usePictumOptions(options),
	});
}
