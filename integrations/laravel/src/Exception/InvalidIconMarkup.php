<?php

declare(strict_types=1);

namespace Pictum\Laravel\Exception;

use RuntimeException;

final class InvalidIconMarkup extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Pictum returned invalid icon SVG markup.');
    }
}
