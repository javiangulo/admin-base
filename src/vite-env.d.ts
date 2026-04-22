/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.css' {
  const css: any
  export default css
}

interface ImportMeta {
  env: Record<string, string>
}
