import type { APIContext } from 'astro';
import { z } from 'zod';

interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export class RequestValidator {
  private schemas: Map<string, z.ZodType<any>>;

  constructor() {
    this.schemas = new Map();
    this.initializeSchemas();
  }

  private initializeSchemas() {
    // Define validation schemas for different endpoints
    this.schemas.set('/api/threats', z.object({
      severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
      category: z.string().optional(),
      timeframe: z.number().positive().optional()
    }));
  }

  async validate(context: APIContext): Promise<ValidationResult> {
    const schema = this.schemas.get(context.url.pathname);
    
    if (!schema) {
      return { valid: true };
    }

    try {
      const params = Object.fromEntries(context.url.searchParams);
      schema.parse(params);
      return { valid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.errors.map(e => e.message)
        };
      }
      return {
        valid: false,
        errors: ['Invalid request parameters']
      };
    }
  }
}