<img {{ $attributes->except(['src', 'width', 'height'])->merge(['src' => $asset->url, 'width' => $logicalWidth, 'height' => $logicalHeight]) }}>
