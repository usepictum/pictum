import type { PlaceholderAssetProps } from "pictum";
import type { ComponentPropsWithoutRef } from "react";

type NativeImageProps = Omit<
	ComponentPropsWithoutRef<"img">,
	"children" | "src"
>;
type PlaceholderImageProps = Omit<
	NativeImageProps,
	"color" | "height" | "width" | keyof PlaceholderAssetProps
>;

export type PlaceholderProps = PlaceholderImageProps & PlaceholderAssetProps;
