<<<<<<< HEAD
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other env vars here if needed
=======
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
>>>>>>> d2ce24e9333ebda8a2616eeba492a352427af152
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
