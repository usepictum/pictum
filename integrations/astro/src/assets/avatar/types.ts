import type { HTMLAttributes } from "astro/types";
import type { AvatarAssetProps } from "pictum";

type NativeImageProps = Omit<
	HTMLAttributes<"img">,
	"src" | keyof AvatarAssetProps
>;

export type AvatarProps = NativeImageProps & AvatarAssetProps;
