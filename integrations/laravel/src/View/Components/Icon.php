<?php

declare(strict_types=1);

namespace Pictum\Laravel\View\Components;

use Illuminate\View\Component;
use Pictum\Laravel\IconMarkupLoader;

final class Icon extends Component
{
    public readonly string $body;

    public readonly string $viewBox;

    public function __construct(
        IconMarkupLoader $loader,
        string $name,
        ?string $baseUrl = null,
    ) {
        $markup = $loader->load($name, $baseUrl);
        $this->body = $markup->body;
        $this->viewBox = $markup->viewBox;
    }

    public function render(): string
    {
        return 'pictum::components.icon';
    }
}
