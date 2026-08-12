<?php

declare(strict_types=1);

namespace Pictum\Laravel;

final readonly class IconMarkup
{
    public function __construct(
        public string $viewBox,
        public string $body,
    ) {}
}
