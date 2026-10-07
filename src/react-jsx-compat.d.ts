// Compatibility typing for the repository's React 19 JSX runtime.
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
