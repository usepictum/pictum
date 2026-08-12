<?php

declare(strict_types=1);

namespace Pictum\Laravel\View\Components;

use Illuminate\View\Component;
use LogicException;
use Pictum\Pictum;
use Pictum\PictumAsset;
use Pictum\PlaceholderFormat;

final class Placeholder extends Component
{
    public readonly PictumAsset $asset;

    public readonly int $logicalHeight;

    public readonly int $logicalWidth;

    public function __construct(
        Pictum $pictum,
        ?int $size = null,
        ?int $width = null,
        ?int $height = null,
        PlaceholderFormat|string $format = PlaceholderFormat::Svg,
        ?int $density = null,
        ?string $background = null,
        ?string $color = null,
        ?string $text = null,
        ?string $baseUrl = null,
    ) {
        $this->asset = $pictum->placeholder(
            $size,
            $width,
            $height,
            $format,
            $density,
            $background,
            $color,
            $text,
            $baseUrl,
        );

        $this->logicalWidth = $size ?? $width ?? throw new LogicException('Missing placeholder width.');
        $this->logicalHeight = $size ?? $height ?? throw new LogicException('Missing placeholder height.');
    }

    public function render(): string
    {
        return 'pictum::components.placeholder';
    }
}
