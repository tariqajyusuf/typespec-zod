import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { List, StatementList } from "@alloy-js/core";
import { d } from "@alloy-js/core/testing";
import { it } from "vitest";
import { ZodSchema } from "../src/components/ZodSchema.js";
import { ZodSchemaDeclaration } from "../src/components/ZodSchemaDeclaration.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with basic models", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      stringProp: string,
      optionalStringProp?: string
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        stringProp: z.string(),
        optionalStringProp: z.string().optional(),
      })
    `);
});
it("works with models with basic constraints", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      @maxLength(10)
      stringProp: string,

      @minValue(10)
      numberProp: float64
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        stringProp: z.string().max(10),
        numberProp: z.number().gte(10),
      })
    `);
});
it("works with records", async () => {
  const runner = await createTestRunner();
  const {
    Test,
    Test2
  } = await runner.compile(`
    @test model Test {
      ... Record<string>
    }

    @test model Test2 extends Record<string> {}
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.record(z.string(), z.string())
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test2
  }), d`
      z.record(z.string(), z.string())
    `);
});
it("works with records with properties", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      prop: "hi",
      ... Record<float64>
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.intersection(
        z.object({
          prop: z.literal("hi"),
        }),
        z.record(z.string(), z.number())
      )
    `);
});
it("works with nested objects", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      prop: {
        nested: true
      }
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        prop: z.object({
          nested: z.literal(true),
        }),
      })
    `);
});
it("works with referencing other schema declarations in members", async () => {
  const runner = await createTestRunner();
  const {
    mystring,
    Test
  } = await runner.compile(`
    @test scalar mystring extends string;

    @test model Test {
      @maxLength(2)
      prop: mystring
    }
  `);
  expectRender(runner.program, _$createComponent(StatementList, {
    get children() {
      return [_$createComponent(ZodSchemaDeclaration, {
        type: mystring
      }), _$createComponent(ZodSchemaDeclaration, {
        type: Test
      })];
    }
  }), d`
      const mystring = z.string();
      const Test = z.object({
        prop: mystring.max(2),
      });
    `);
});
it("allows name to be a getter", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      @maxLength(2)
      prop: string
    }
  `);
  function getName() {
    return "hello" + "there";
  }
  expectRender(runner.program, _$createComponent(StatementList, {
    get children() {
      return _$createComponent(ZodSchemaDeclaration, {
        type: Test,
        get name() {
          return getName();
        }
      });
    }
  }), d`
      const hellothere = z.object({
        prop: z.string().max(2),
      });
    `);
});
it("renders model and property docs", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    /**
     * This is an awesome model! It does things
     * that are interesting.
     **/
    @test model Test {
      /**
       * This is a property. It is also
       * interesting.
       **/
      @maxLength(2)
      prop: string
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z
        .object({
          prop: z
            .string()
            .max(2)
            .describe("This is a property. It is also interesting."),
        })
        .describe("This is an awesome model! It does things that are interesting.")
    `);
});
it("works with arrays", async () => {
  const runner = await createTestRunner();
  const {
    scalarArray,
    scalarArray2,
    modelArray
  } = await runner.compile(`
    model Test {
      @test scalarArray: string[];
      @test scalarArray2: string[][];
      @test modelArray: {x: string, y: string}[];
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return scalarArray.type;
    }
  }), "z.array(z.string())");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return scalarArray2.type;
    }
  }), "z.array(z.array(z.string()))");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return modelArray.type;
    }
  }), d`
      z.array(z.object({
        x: z.string(),
        y: z.string(),
      }))
    `);
});
it("works with model properties with array constraints", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      @maxItems(2)
      prop: string[]
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        prop: z.array(z.string()).max(2),
      })
    `);
});
it("works with array declarations", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @maxItems(5)
    @test model Test is Array<string>{}
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.array(z.string()).max(5)
    `);
});
it("handles references", async () => {
  const runner = await createTestRunner();
  const {
    Test,
    Test2,
    Item
  } = await runner.compile(`
    @test model Item {};

    /** Simple array */
    @test model Test is Array<Item>{}

    @test model Test2 {
      /** single array */
      prop1: Item[],

      /** nested array */
      @maxItems(5)
      prop2: Item[][],
    }
  `);
  expectRender(runner.program, _$createComponent(StatementList, {
    get children() {
      return [_$createComponent(ZodSchemaDeclaration, {
        type: Item
      }), _$createComponent(ZodSchemaDeclaration, {
        type: Test
      }), _$createComponent(ZodSchemaDeclaration, {
        type: Test2
      })];
    }
  }), d`
      const Item = z.object({});
      const Test = z.array(Item).describe("Simple array");
      const Test2 = z.object({
        prop1: z.array(Item).describe("single array"),
        prop2: z.array(z.array(Item)).max(5).describe("nested array"),
      });
    `);
});
it("supports property defaults", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      number: float64 = 5;
      string: string = "hello";
      boolean: boolean = true;
      array: string[] = #["hello"];
      null: null = null;
      dateTime: utcDateTime = utcDateTime.fromISO("2025-01-01T00:00:00Z");
      offsetDateTime: offsetDateTime = offsetDateTime.fromISO("2025-01-01T00:00:00+01:00");
      plainTime: plainTime = plainTime.fromISO("10:01:00");
      plainDate: plainDate = plainDate.fromISO("2025-01-01");
      duration: duration = duration.fromISO("P1Y2M3DT4H5M6S");
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        number: z.number().default(5),
        string: z.string().default("hello"),
        boolean: z.boolean().default(true),
        array: z.array(z.string()).default(["hello"]),
        null: z.null().default(null),
        dateTime: z.coerce.date().default("2025-01-01T00:00:00Z"),
        offsetDateTime: z.coerce.date().default("2025-01-01T00:00:00+01:00"),
        plainTime: z.string().time().default("10:01:00"),
        plainDate: z.coerce.date().default("2025-01-01"),
        duration: z.string().duration().default("P1Y2M3DT4H5M6S"),
      })
    `);
});
it("supports model extends", async () => {
  const runner = await createTestRunner();
  const {
    Point2D,
    Point3D
  } = await runner.compile(`
    @test model Point2D {
      x: float64,
      y: float64
    }

    @test model Point3D extends Point2D {
      z: float64
    }
  `);
  expectRender(runner.program, _$createComponent(List, {
    get children() {
      return [_$createComponent(ZodSchemaDeclaration, {
        type: Point2D
      }), _$createComponent(ZodSchemaDeclaration, {
        type: Point3D
      })];
    }
  }), d`
      const Point2D = z.object({
        x: z.number(),
        y: z.number(),
      })
      const Point3D = Point2D.merge(z.object({
        z: z.number(),
      }))
    `);
});

// this will require some sophistication (i.e. cycle detection)
it.skip("works with circular references", async () => {
  const runner = await createTestRunner();
  const {
    Test
  } = await runner.compile(`
    @test model Test {
      prop: Test
    }
  `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: Test
  }), d`
      z.object({
        prop: z.lazy(() => Test),
      })
    `);
});
//# sourceMappingURL=models.test.js.map