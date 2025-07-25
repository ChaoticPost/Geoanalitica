/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_2GIS_API_KEY: string
}
 
interface ImportMeta {
  readonly env: ImportMetaEnv
} 