// to make the file a module and avoid the TypeScript error

export {};

declare global {
  /* eslint-disable no-unused-vars */
  namespace Express {
    export interface Request {
      userId?: number;
      cleanBody?: unknown;
      role: string;
      rawBody?: Buffer;
    }
  }
}
