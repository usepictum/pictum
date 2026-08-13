import type {
	AvatarAssetProps,
	IconAssetProps,
	PictumOptions,
	PlaceholderAssetProps,
	QrCodeAssetProps,
} from "pictum";
import type { Snippet } from "svelte";
import type { HTMLImgAttributes, SVGAttributes } from "svelte/elements";

type NativeImageProps = Omit<
	HTMLImgAttributes,
	"children" | "src" | keyof AvatarAssetProps
>;
type NativeSvgProps = Omit<
	SVGAttributes<SVGSVGElement>,
	"children" | "innerHTML" | keyof IconAssetProps
>;
type PlaceholderImageProps = Omit<
	HTMLImgAttributes,
	| "children"
	| "color"
	| "height"
	| "src"
	| "width"
	| keyof PlaceholderAssetProps
>;
type QrCodeImageProps = Omit<
	HTMLImgAttributes,
	"children" | "src" | keyof QrCodeAssetProps
>;

export type AvatarProps = NativeImageProps & AvatarAssetProps;
export type IconProps = NativeSvgProps & IconAssetProps;
export type PlaceholderProps = PlaceholderImageProps & PlaceholderAssetProps;
export type QrCodeProps = QrCodeImageProps & QrCodeAssetProps;
export interface PictumProviderProps {
	children?: Snippet;
	options?: PictumOptions;
}

export type MaybeGetter<Value> = Value | (() => Value);

export interface ReactiveValue<Value> {
	readonly current: Value;
}
