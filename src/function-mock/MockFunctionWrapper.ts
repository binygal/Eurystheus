import { jest } from "@jest/globals";
import { FunctionLike } from "jest-mock";
import { ParametersConfig } from "./ParametersConfig";
import {
  justReturn,
  promisifyResult,
  rejectifyResult,
} from "./implementationCreator";

interface WhenWrapper<T extends FunctionLike> {
  calledWith(...args: Parameters<T>): MockReturnValueConfig<T>;
}

class MockFunctionWrapper<T extends FunctionLike> implements WhenWrapper<T> {
  private mockedFunction: jest.Mock<T>;
  private configuredResults: ParametersConfig<T>[] = [];

  constructor(mockedFunction: jest.Mock<T>) {
    this.mockedFunction = mockedFunction;
    this.mockedFunction.mockImplementation(this.implementation());
  }

  calledWith(...args: Parameters<T>): MockReturnValueConfig<T> {
    return new MockReturnValueConfig(args, this);
  }

  implementation(): T {
    const mockedImplementation = (...args: Parameters<T>): ReturnType<T> => {
      const resultIdx = this.configuredResults.findIndex((configuredResult) =>
        configuredResult.isMatch(args)
      );
      const result = this.configuredResults[resultIdx];
      if (!result) {
        return undefined;
      }
      const resultValue = result.result(args);
      if (result.extras.once) {
        this.configuredResults.splice(resultIdx, 1);
      }
      return resultValue;
    };
    return mockedImplementation as T;
  }

  setConfiguredResult(
    params: Parameters<T>,
    implementation: T,
    once: boolean = false
  ) {
    this.configuredResults.push(
      new ParametersConfig(params, implementation, { once })
    );
  }
}

class MockReturnValueConfig<T extends FunctionLike> {
  private params: Parameters<T>;
  private mockFunctionWrapper: MockFunctionWrapper<T>;
  constructor(
    params: Parameters<T>,
    mockFunctionWrapper: MockFunctionWrapper<T>
  ) {
    this.params = params;
    this.mockFunctionWrapper = mockFunctionWrapper;
  }

  mockReturnValue(result: ReturnType<T>) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      justReturn(result)
    );
  }

  mockRejectedValue(result: unknown) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      rejectifyResult(result)
    );
  }

  mockResolvedValue(result: Awaited<ReturnType<T>>) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      promisifyResult(result)
    );
  }

  mockRejectedValueOnce(result: unknown) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      rejectifyResult(result),
      true
    );
  }
  mockResolvedValueOnce(result: Awaited<ReturnType<T>>) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      promisifyResult(result),
      true
    );
  }

  mockReturnValueOnce(result: ReturnType<T>) {
    this.mockFunctionWrapper.setConfiguredResult(
      this.params,
      justReturn(result),
      true
    );
  }
}

export function when<T extends FunctionLike>(
  mockedFn: jest.Mock<T>
): WhenWrapper<T> {
  return new MockFunctionWrapper(mockedFn);
}
