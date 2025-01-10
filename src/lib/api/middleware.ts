import type { APIContext, APIRoute } from 'astro';
import { ErrorHandler } from './errorHandler';

const errorHandler = new ErrorHandler();

export function createAPIRoute(handler: APIRoute): APIRoute {
  return async (context) => {
    try {
      const response = await handler(context);
      return response;
    } catch (error) {
      return errorHandler.handleError(error);
    }
  };
}