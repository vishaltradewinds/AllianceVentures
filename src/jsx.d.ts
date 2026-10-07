// Repository-wide JSX fallback typing for the existing React/Vite application.
// Keeps the type-check independent of an additional @types/react dependency.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
