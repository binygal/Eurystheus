import { FunctionLike } from "jest-mock";

export function justReturn<T extends FunctionLike>(result: ReturnType<T>): T {
  return (() => result) as T;
}

export function promisifyResult<T extends FunctionLike>(
  result: Awaited<ReturnType<T>>
): T {
  return (() => Promise.resolve(result)) as T;
}

export function rejectifyResult<T extends FunctionLike>(result: unknown) {
  return (() => Promise.reject(result)) as T;
}
