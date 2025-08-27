declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare;
module "*.css";

interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_NOTEHUB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
