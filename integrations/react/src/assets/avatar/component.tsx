import type { AvatarOptions } from "pictum";
import { useAvatar } from "./helper";
import type { AvatarProps } from "./types";

export function Avatar({
	seed,
	variant,
	gender,
	format,
	size,
	options,
	alt,
	...imageProps
}: AvatarProps) {
	const helperOptions = {
		...(options ?? {}),
		...(variant === undefined ? {} : { variant }),
		...(gender === undefined ? {} : { gender }),
		...(format === undefined ? {} : { format }),
		...(size === undefined ? {} : { size }),
	} as AvatarOptions;
	const asset = useAvatar(seed, helperOptions);

	return <img {...imageProps} src={asset.url} alt={alt} />;
}
