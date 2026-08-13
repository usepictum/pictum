import type { AvatarAssetProps } from "pictum";
import type { ComponentPropsWithoutRef } from "react";

type NativeImageProps = Omit<
	ComponentPropsWithoutRef<"img">,
	"children" | "src" | keyof AvatarAssetProps
>;

export type AvatarProps = NativeImageProps & AvatarAssetProps;
