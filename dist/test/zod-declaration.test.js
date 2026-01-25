import { createComponent as _$createComponent, createIntrinsic as _$createIntrinsic, memo as _$memo } from "@alloy-js/core/jsx-runtime";
import { refkey } from "@alloy-js/core";
import { d } from "@alloy-js/core/testing";
import { it } from "vitest";
import { ZodSchemaDeclaration } from "../src/index.js";
import { createTestRunner, expectRender } from "./utils.js";
it("allows specifying refkey", async () => {
  const rk = refkey();
  const runner = await createTestRunner();
  const {
    MyModel
  } = await runner.compile(`
    @test model MyModel {
      id: string;
    }
  `);
  const template = [_$createComponent(ZodSchemaDeclaration, {
    type: MyModel,
    name: "foo",
    refkey: rk
  }), ";", _$createIntrinsic("hbr", {}), rk, ";"];
  expectRender(runner.program, template, d`
      const foo = z.object({
        id: z.string(),
      });
      foo;
    `);
});
it("allows specifying a refkey dynamically", async () => {
  const runner = await createTestRunner();
  const {
    MyModel
  } = await runner.compile(`
    @test model MyModel {
      id: string;
    }
  `);
  const rk = refkey();
  function getRefkey() {
    return rk;
  }
  const template = [_$createComponent(ZodSchemaDeclaration, {
    type: MyModel,
    name: "foo",
    get refkey() {
      return getRefkey();
    }
  }), ";", _$createIntrinsic("hbr", {}), _$memo(getRefkey), ";"];
  expectRender(runner.program, template, d`
      const foo = z.object({
        id: z.string(),
      });
      foo;
    `);
});
//# sourceMappingURL=zod-declaration.test.js.map