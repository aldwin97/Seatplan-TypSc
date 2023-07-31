declare module 'dom-to-image' {
    interface Options {
      quality?: number;
      width?: number;
      height?: number;
      style?: {
        [key: string]: string | number;
      };
      filter?: (element: HTMLElement) => boolean;
      bgcolor?: string;
      cacheBust?: boolean;
      imagePlaceholder?: string;
      cache?: boolean;
      useCORS?: boolean;
      imageTimeout?: number;
      removeContainer?: boolean;
    }
  
    export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
    export function toPng(node: HTMLElement, options?: Options): Promise<string>;
    export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  }
  