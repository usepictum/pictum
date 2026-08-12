<?php

declare(strict_types=1);

namespace Pictum\Laravel\View\Components;

use Illuminate\View\Component;
use InvalidArgumentException;
use Pictum\Pictum;
use Pictum\PictumAsset;
use Pictum\QrCodeFormat;

final class QrCode extends Component
{
    public readonly PictumAsset $asset;

    public function __construct(
        Pictum $pictum,
        string $value,
        QrCodeFormat|string $format = QrCodeFormat::Svg,
        ?string $baseUrl = null,
        bool|string|null $quietZone = null,
        ?string $foreground = null,
        ?string $background = null,
    ) {
        $this->asset = $pictum->qrCode(
            value: $value,
            format: $format,
            baseUrl: $baseUrl,
            quietZone: self::normalizeQuietZone($quietZone),
            foreground: $foreground,
            background: $background,
        );
    }

    public function render(): string
    {
        return 'pictum::components.qr-code';
    }

    private static function normalizeQuietZone(bool|string|null $quietZone): ?bool
    {
        if ($quietZone === null || is_bool($quietZone)) {
            return $quietZone;
        }

        return match (strtolower(trim($quietZone))) {
            'true', '1' => true,
            'false', '0' => false,
            default => throw new InvalidArgumentException('QR code quietZone must be a boolean.'),
        };
    }
}
