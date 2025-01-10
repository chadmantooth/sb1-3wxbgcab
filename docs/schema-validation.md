# Troubleshooting Astro MDX Schema Validation Errors

## Common Error Messages

```
[content] Invalid frontmatter in [file].mdx:
  [property] is required at frontmatter
```

This error occurs when required frontmatter properties are missing or incorrectly formatted.

## Common Causes

1. Missing required frontmatter fields
2. Incorrect data types (e.g., string instead of date)
3. Malformed YAML syntax in frontmatter
4. Inconsistent date formats
5. Array values not properly formatted

## Step-by-Step Troubleshooting

1. **Check Schema Definition**
   - Verify your schema in `src/content/config.ts`
   - Ensure all required fields are properly defined
   - Check data type definitions match your content

2. **Validate Frontmatter Format**
   ```yaml
   ---
   title: "My Post"
   description: "Post description"
   publishDate: 2024-12-26
   author: "John Doe"
   featured: false
   tags: ["astro", "mdx"]
   ---
   ```

3. **Common Fixes**
   - Add missing required fields
   - Fix date formatting (use YYYY-MM-DD)
   - Ensure boolean values are `true`/`false`
   - Format arrays with proper YAML syntax

4. **Using Zod Effectively**
   ```typescript
   // Optional fields with defaults
   author: z.string().optional(),
   featured: z.boolean().default(false),
   
   // Required fields
   title: z.string(),
   publishDate: z.coerce.date(),
   
   // Array validation
   tags: z.array(z.string()).default([])
   ```

## Prevention Tips

1. Create a frontmatter template
2. Use TypeScript for schema definitions
3. Implement pre-commit validation
4. Document schema requirements
5. Use consistent date formats

## Relevant Documentation

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Zod Schema Validation](https://docs.astro.build/en/guides/content-collections/#defining-a-collection-schema)
- [Frontmatter Reference](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout)