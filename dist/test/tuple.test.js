import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { StatementList } from "@alloy-js/core";
import { d } from "@alloy-js/core/testing";
import { it } from "vitest";
import { ZodSchemaDeclaration } from "../src/index.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works", async () => {
  const runner = await createTestRunner();
  const {
    Test,
    Ref
  } = await runner.compile(`
    @test model Ref {}

    model Container {
      @test Test: ["one", { a: 1, b: 2 }, Ref];
    }
  `);
  expectRender(runner.program, _$createComponent(StatementList, {
    get children() {
      return [_$createComponent(ZodSchemaDeclaration, {
        type: Ref
      }), _$createComponent(ZodSchemaDeclaration, {
        get type() {
          return Test.type;
        },
        name: "tuple"
      })];
    }
  }), d`
      const Ref = z.object({});
      const tuple = z.tuple([
        z.literal("one"),
        z.object({
          a: z.literal(1),
          b: z.literal(2),
        }),
        Ref
      ]);
    `);
});
//# sourceMappingURL=tuple.test.js.map