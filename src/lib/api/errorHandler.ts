export class ErrorHandler {
  handleError(error: unknown): Response {
    const errorResponse = this.formatError(error);
    
    return new Response(JSON.stringify({
      error: errorResponse.message,
      status: errorResponse.status
    }), {
      status: errorResponse.status || 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  private formatError(error: unknown): APIError {
    if (error instanceof APIError) {
      return error;
    }

    const message = error instanceof Error ? error.message : 'Internal server error';
    return new APIError(message, 500);
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}