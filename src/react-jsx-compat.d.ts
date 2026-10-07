// React 19 JSX compatibility for the existing application.
import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}
