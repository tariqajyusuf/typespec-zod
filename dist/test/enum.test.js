import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { it } from "vitest";
import { ZodSchema } from "../src/index.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with no values", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test enum Test {
      A, B
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), `z.enum(["A", "B"])`);
});
it("works with string values", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test enum Test {
      A: "a", B: "b"
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), `z.enum(["a", "b"])`);
});
it("works with number values", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test enum Test {
      A: 1, B: 2
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), `z.enum([1, 2])`);
});
//# sourceMappingURL=enum.test.js.map