import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { it } from "vitest";
import { ZodSchema } from "../src/components/ZodSchema.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with literals", async () => {
  const runner = await createTestRunner();
  const {
    stringProp,
    numberProp,
    booleanProp
  } = await runner.compile(`
    model Test {
      @test
      stringProp: "hello",

      @test
      numberProp: 123,

      @test
      booleanProp: true,
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return stringProp.type;
    }
  }), 'z.literal("hello")');
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return numberProp.type;
    }
  }), "z.literal(123)");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return booleanProp.type;
    }
  }), "z.literal(true)");
});
//# sourceMappingURL=literals.test.js.map