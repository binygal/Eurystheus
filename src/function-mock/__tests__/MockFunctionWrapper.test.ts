import { expect, jest, test, describe } from "@jest/globals";
import { when } from "../MockFunctionWrapper";

describe("mockReturnValue", () => {
  test("should return the right value when called with the right parameters", () => {
    const mockFunction = jest.fn<(string) => number>();
    when(mockFunction).calledWith("foo").mockReturnValue(1);

    const value = mockFunction("foo");

    expect(value).toBe(1);
  });

  test("should not return the value when called with other value", () => {
    const mockFunction = jest.fn<(string) => number>();

    when(mockFunction).calledWith("foo").mockReturnValue(1);

    const value = mockFunction("bar");
    expect(value).toBeUndefined();
  });
});

describe("mockResolvedValue", () => {
  test("should resolve with the right value when called with the right parameter", async () => {
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockResolvedValue(1);

    const value = mockFunction("foo");
    const awaitedValue = await value;
    expect(value).toBeInstanceOf(Promise);
    expect(awaitedValue).toBe(1);
  });

  test("should not resolve with the right value when called with another parameter", () => {
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockResolvedValue(1);

    const value = mockFunction("bar");
    expect(value).toBeUndefined();
  });
});

describe("mockRejectedValue", () => {
  test("should reject with the right value when called with the right parameter", async () => {
    const error = { message: "some error" };
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockRejectedValue(error);

    expect(mockFunction("foo")).rejects.toBe(error);
  });

  test("should return undefined when called with the wrong parameter", async () => {
    const error = { message: "some error" };
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockRejectedValue(error);

    expect(() => mockFunction("bar")).not.toThrow();
  });
});

describe("mockRejectedValueOnce", () => {
  test("should reject to the value only once when called with the right value", async () => {
    const error = { message: "some error" };
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockRejectedValueOnce(error);

    expect(mockFunction("foo")).rejects.toBe(error);
    expect(() => mockFunction("foo")).not.toThrow();
  });

  test("should return undefined when called with the wrong value", async () => {
    const error = { message: "some error" };
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockRejectedValueOnce(error);

    expect(() => mockFunction("bar")).not.toThrow();
  });
});

describe("mockResolvedValueOnce", () => {
  test("should resolve only once with the right value when called with the right parameter", async () => {
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockResolvedValueOnce(1);

    const value = mockFunction("foo");
    const awaitedValue = await value;
    expect(value).toBeInstanceOf(Promise);
    expect(awaitedValue).toBe(1);
    expect(mockFunction("foo")).toBeUndefined();
  });

  test("should not resolve with the right value when called with another parameter", () => {
    const mockFunction = jest.fn<(string) => Promise<number>>();

    when(mockFunction).calledWith("foo").mockResolvedValueOnce(1);

    const value = mockFunction("bar");
    expect(value).toBeUndefined();
  });
});

describe("mockReturnValueOnce", () => {
  test("should return the right value only once when called with the right parameters", () => {
    const mockFunction = jest.fn<(string) => number>();
    when(mockFunction).calledWith("foo").mockReturnValueOnce(1);

    const value = mockFunction("foo");
    const secondValue = mockFunction("foo");

    expect(value).toBe(1);
    expect(secondValue).toBeUndefined();
  });

  test("should not return the value when called with other value", () => {
    const mockFunction = jest.fn<(string) => number>();

    when(mockFunction).calledWith("foo").mockReturnValueOnce(1);

    const value = mockFunction("bar");
    expect(value).toBeUndefined();
  });
});
