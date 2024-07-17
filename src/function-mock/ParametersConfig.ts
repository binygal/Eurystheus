import { FunctionLike } from "jest-mock";

export type ParametersConfigExtra = {
  once: boolean;
};

export class ParametersConfig<T extends FunctionLike> {
  private params: Parameters<T>;
  private implementation: T;
  extras: ParametersConfigExtra;

  constructor(
    params: Parameters<T>,
    implementation: T,
    extras?: ParametersConfigExtra
  ) {
    this.params = params;
    this.implementation = implementation;
    this.extras = extras ?? { once: false };
  }

  isMatch(params: Parameters<T>) {
    return params.every((param, idx) => param === this.params[idx]);
  }

  get result() {
    return this.implementation;
  }
}
