import { compile } from "../src/compile";

describe("compile", () => {
  it("should return a value", async () => {
    const exec = compile("return 1", {});

    const result = await exec();
    
    expect(result).toBe(1);
  });

  it("should access variables from the context", async () => {
    const exec = compile("return a + b", { a: 1, b: 2 });

    const result = await exec();

    expect(result).toBe(3);
  });

  it("globals should be undefined", async () => {
    const exec = compile("return console;", {});

    const result = await exec();

    expect(result).toBe(undefined);
  });
});
