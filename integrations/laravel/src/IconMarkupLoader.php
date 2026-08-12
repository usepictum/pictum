<?php

declare(strict_types=1);

namespace Pictum\Laravel;

use Illuminate\Contracts\Cache\Repository;
use Pictum\Laravel\Exception\InvalidIconMarkup;
use Pictum\Pictum;

final readonly class IconMarkupLoader
{
    private const CACHE_PREFIX = 'pictum:icon:v1:';

    public function __construct(
        private Pictum $pictum,
        private Repository $cache,
    ) {}

    public function load(string $name, ?string $baseUrl = null): IconMarkup
    {
        $asset = $this->pictum->icon($name, $baseUrl);
        $key = self::CACHE_PREFIX.hash('sha256', $asset->url);
        $markup = $this->cache->rememberForever(
            $key,
            fn (): IconMarkup => $this->parse($asset->svg()),
        );

        return $markup;
    }

    private function parse(string $svg): IconMarkup
    {
        $root = [];

        if (preg_match('/^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i', $svg, $root) !== 1) {
            throw new InvalidIconMarkup;
        }

        $attributes = $root[1] ?? '';
        $body = $root[2] ?? '';
        $viewBox = [];

        if (preg_match('/\bviewBox\s*=\s*(["\'])(.*?)\1/i', $attributes, $viewBox) !== 1) {
            throw new InvalidIconMarkup;
        }

        return new IconMarkup($viewBox[2] ?? '', $body);
    }
}
