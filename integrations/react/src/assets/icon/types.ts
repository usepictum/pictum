import type { IconAssetProps } from "pictum";
import type { ComponentPropsWithoutRef } from "react";

type NativeSvgProps = Omit<
	ComponentPropsWithoutRef<"svg">,
	"children" | "dangerouslySetInnerHTML" | keyof IconAssetProps
>;

export type IconProps = NativeSvgProps & IconAssetProps;
