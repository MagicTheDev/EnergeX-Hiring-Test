<?php

namespace App\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
    ];

    public function report(Throwable $e): void
    {
        parent::report($e);
    }

    public function render($request, Throwable $e)
    {
        // Return JSON for API by default
        if ($request->expectsJson()) {
            $status = 500;
            if ($e instanceof HttpException) {
                $status = $e->getStatusCode();
            }
            return response()->json([
                'message' => $e->getMessage() ?: 'Server Error',
            ], $status);
        }

        return parent::render($request, $e);
    }
}
