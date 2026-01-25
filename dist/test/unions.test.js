import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { d } from "@alloy-js/core/testing";
import { it } from "vitest";
import { ZodSchema } from "../src/index.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with union expressions", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      prop: "hi" | "ho" | "ha"
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        prop: z.union([z.literal("hi"), z.literal("ho"), z.literal("ha")]),
      })
    `);
});
it("works with discriminated unions with envelope", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @discriminated
    @test union Test {
      one: { oneItem: true },
      two: true
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.discriminatedUnion(
        "kind",
        [
          z.object({
            kind: z.literal("one"),
            value: z.object({
              oneItem: z.literal(true),
            }),
          }),
          z.object({
            kind: z.literal("two"),
            value: z.literal(true),
          })
        ]
      )
    `);
});
it("works with discriminated unions without envelope", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @discriminated(#{ envelope: "none" })
    @test union Test {
      one: { kind: "one", value: 1 };
      two: { kind: "two", value: 2 };
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.discriminatedUnion(
        "kind",
        [
          z.object({
            kind: z.literal("one"),
            value: z.literal(1),
          }),
          z.object({
            kind: z.literal("two"),
            value: z.literal(2),
          })
        ]
      )
    `);
});
it("works with non-discriminated unions", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test union Test {
      one: { oneItem: true },
      two: true
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.union([
        z.object({
          oneItem: z.literal(true),
        }),
        z.literal(true)
      ])
    `);
});
it("works with the unknown variant (by not emitting it)");
//# sourceMappingURL=unions.test.js.map