/// <reference path="../.astro/types.d.ts" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SECURITY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}