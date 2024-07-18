# Eurystheus

A library to write stable, readable and beautiful tests.

## How to use it?

You need to wrap your jest mock function with the `when` function. Now you can use `mockX` on the result.
For example, if we have a mock function that should return 1 when called with "foo" this how we should set
it in the code.
When calling `mockFunction` in this code it will return `1` if called with "foo" and `undefined` if called with anything else.

```typescript
const mockFunction = jest.fn();
when(mockFunction).calledWith("foo").mockReturnValue(1);
```

#### Why Eurystheus?

Just like the greek king that tested Hercules in the famous mythology, this library is helping to test
stuff and make sure it's all working as expected.
