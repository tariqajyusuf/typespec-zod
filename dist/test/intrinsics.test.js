import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { it } from "vitest";
import { ZodSchema } from "../src/components/ZodSchema.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with intrinsics", async () => {
  const runner = await createTestRunner();
  const {
    nullProp,
    neverProp,
    unknownProp,
    voidProp
  } = await runner.compile(`
    model Test {
      @test
      nullProp: null,

      @test
      neverProp: never,

      @test
      unknownProp: unknown,

      @test
      voidProp: void,
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return nullProp.type;
    }
  }), "z.null()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return neverProp.type;
    }
  }), "z.never()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return unknownProp.type;
    }
  }), "z.unknown()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return voidProp.type;
    }
  }), "z.void()");
});
//# sourceMappingURL=intrinsics.test.js.map