import { createComponent as _$createComponent, createIntrinsic as _$createIntrinsic } from "@alloy-js/core/jsx-runtime";
import { d } from "@alloy-js/core/testing";
import { describe, it } from "vitest";
import { ZodSchema } from "../src/components/ZodSchema.js";
import { ZodSchemaDeclaration } from "../src/index.js";
import { createTestRunner, expectRender } from "./utils.js";
it("works with boolean", async () => {
  const runner = await createTestRunner();
  const {
    booleanProp
  } = await runner.compile(`
      model Test {
        @test
        booleanProp: boolean,
      }
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return booleanProp.type;
    }
  }), "z.boolean()");
});
it("works with string", async () => {
  const runner = await createTestRunner();
  const {
    stringProp,
    shortStringProp,
    urlProp,
    uuidProp,
    patternProp
  } = await runner.compile(`
      @maxLength(10)
      @minLength(5)
      scalar shortString extends string;

      @test
      @format("uuid")
      scalar uuidProp extends string;

      @test
      @pattern("[0-9]+")
      scalar patternProp extends string;
      

      model Test {
        @test stringProp: string,
        @test shortStringProp: shortString,
        @test urlProp: url
      }
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return stringProp.type;
    }
  }), "z.string()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return shortStringProp.type;
    }
  }), "z.string().min(5).max(10)");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return urlProp.type;
    }
  }), "z.string().url()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: uuidProp
  }), "z.string().uuid()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: patternProp
  }), "z.string().regex(/[0-9]+/)");
});
describe("numerics", () => {
  it("handles numeric constraints", async () => {
    const runner = await createTestRunner();
    const {
      int8WithMin,
      int8WithMinMax,
      int8WithMinExclusive,
      int8WithMinMaxExclusive
    } = await runner.compile(`
      @test @minValue(-20) scalar int8WithMin extends int8;
      @test @minValue(-20) @maxValue(20) scalar int8WithMinMax extends int8;
      @test @minValueExclusive(2) scalar int8WithMinExclusive extends int8; 
      @test @minValueExclusive(2) @maxValueExclusive(20) scalar int8WithMinMaxExclusive extends int8;
    `);
    expectRender(runner.program, _$createComponent(ZodSchema, {
      type: int8WithMin
    }), "z.number().int().gte(-20).lte(127)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      type: int8WithMinMax
    }), "z.number().int().gte(-20).lte(20)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      type: int8WithMinExclusive
    }), "z.number().int().gt(2).lte(127)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      type: int8WithMinMaxExclusive
    }), "z.number().int().gt(2).lt(20)");
  });
  it("works with integers", async () => {
    const runner = await createTestRunner();
    const {
      int8Prop,
      int16Prop,
      int32Prop,
      int64Prop
    } = await runner.compile(`
        model Test {
          @test int8Prop: int8,
          @test int16Prop: int16,
          @test int32Prop: int32,
          @test int64Prop: int64,
        }
      `);
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return int8Prop.type;
      }
    }), "z.number().int().gte(-128).lte(127)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return int16Prop.type;
      }
    }), "z.number().int().gte(-32768).lte(32767)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return int32Prop.type;
      }
    }), "z.number().int().gte(-2147483648).lte(2147483647)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return int64Prop.type;
      }
    }), "z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n)");
  });
  it("works with unsigned integers", async () => {
    const runner = await createTestRunner();
    const {
      uint8Prop,
      uint16Prop,
      uint32Prop,
      uint64Prop,
      safeintProp
    } = await runner.compile(`
      model Test {
        @test uint8Prop: uint8,
        @test uint16Prop: uint16,
        @test uint32Prop: uint32,
        @test uint64Prop: uint64,
        @test safeintProp: safeint,
      }
    `);
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return uint8Prop.type;
      }
    }), "z.number().int().nonnegative().lte(255)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return uint16Prop.type;
      }
    }), "z.number().int().nonnegative().lte(65535)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return uint32Prop.type;
      }
    }), "z.number().int().nonnegative().lte(4294967295)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return uint64Prop.type;
      }
    }), "z.bigint().nonnegative().lte(18446744073709551615n)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return safeintProp.type;
      }
    }), "z.number().int().safe()");
  });
  it("works with floats", async () => {
    const runner = await createTestRunner();
    const {
      float32Prop,
      float64Prop,
      floatProp
    } = await runner.compile(`
        model Test {
          @test float32Prop: float32,
          @test float64Prop: float64,
          @test floatProp: float,
        }
      `);
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return float32Prop.type;
      }
    }), "z.number().gte(-3.4028235e+38).lte(3.4028235e+38)");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return float64Prop.type;
      }
    }), "z.number()");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return floatProp.type;
      }
    }), "z.number()");
  });
  it("works with decimals", async () => {
    const runner = await createTestRunner();
    const {
      decimalProp,
      decimal128Prop
    } = await runner.compile(`
        model Test {
          @test decimalProp: decimal,
          @test decimal128Prop: decimal128,
        }
      `);
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return decimalProp.type;
      }
    }), "z.number()");
    expectRender(runner.program, _$createComponent(ZodSchema, {
      get type() {
        return decimal128Prop.type;
      }
    }), "z.number()");
  });
});
it("works with bytes", async () => {
  const runner = await createTestRunner();
  const {
    bytesProp
  } = await runner.compile(`
      model Test {
        @test bytesProp: bytes,
      }
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return bytesProp.type;
    }
  }), "z.any()");
});
it("works with date things", async () => {
  const runner = await createTestRunner();
  const {
    plainDateProp,
    plainTimeProp,
    utcDateTimeProp,
    offsetDateTimeProp,
    durationProp
  } = await runner.compile(`
      model Test {
        @test plainDateProp: plainDate,
        @test plainTimeProp: plainTime,
        @test utcDateTimeProp: utcDateTime,
        @test offsetDateTimeProp: offsetDateTime
      }
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return plainDateProp.type;
    }
  }), "z.coerce.date()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return plainTimeProp.type;
    }
  }), "z.string().time()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return utcDateTimeProp.type;
    }
  }), "z.coerce.date()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    get type() {
      return offsetDateTimeProp.type;
    }
  }), "z.coerce.date()");
});
it("works with dates and encodings", async () => {
  const runner = await createTestRunner();
  const {
    int32Date,
    int64Date,
    rfc3339DateUtc,
    rfc3339DateOffset,
    rfc7231DateUtc,
    rfc7231DateOffset
  } = await runner.compile(`
      @test
      @encode(DateTimeKnownEncoding.unixTimestamp, int32)
      scalar int32Date extends utcDateTime;
      
      @test
      @encode(DateTimeKnownEncoding.unixTimestamp, int64)
      scalar int64Date extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc3339)
      scalar rfc3339DateUtc extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc3339)
      scalar rfc3339DateOffset extends offsetDateTime;
      
      @test
      @encode(DateTimeKnownEncoding.rfc7231)
      scalar rfc7231DateUtc extends utcDateTime;

      @test
      @encode(DateTimeKnownEncoding.rfc7231)
      scalar rfc7231DateOffset extends offsetDateTime;
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: int32Date
  }), "z.number().int().gte(-2147483648).lte(2147483647)");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: int64Date
  }), "z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n)");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: rfc3339DateUtc
  }), "z.string().datetime()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: rfc3339DateOffset
  }), "z.string().datetime()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: rfc7231DateUtc
  }), "z.string()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: rfc7231DateOffset
  }), "z.string()");
});
it("works with durations and encodings", async () => {
  const runner = await createTestRunner();
  const {
    myDuration,
    isoDuration,
    secondsDuration,
    int64SecondsDuration
  } = await runner.compile(`
      @test
      @encode(DurationKnownEncoding.ISO8601)
      scalar isoDuration extends duration;

      @test
      @encode(DurationKnownEncoding.seconds, int32)
      scalar secondsDuration extends duration;
      
      @test
      @encode(DurationKnownEncoding.seconds, int64)
      scalar int64SecondsDuration extends duration;

      @test
      scalar myDuration extends duration;
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: myDuration
  }), "z.string().duration()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: isoDuration
  }), "z.string().duration()");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: secondsDuration
  }), "z.number().int().gte(-2147483648).lte(2147483647)");
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: int64SecondsDuration
  }), "z.bigint().gte(-9223372036854775808n).lte(9223372036854775807n)");
});
it("extends declared scalars", async () => {
  const runner = await createTestRunner();
  const {
    myScalar,
    myAdditionalScalar
  } = await runner.compile(`
    @maxLength(10)
    @test scalar myScalar extends string;

    @minLength(5)
    @test scalar myAdditionalScalar extends myScalar;
  `);
  expectRender(runner.program, [_$createComponent(ZodSchemaDeclaration, {
    type: myScalar
  }), _$createIntrinsic("hbr", {}), _$createComponent(ZodSchemaDeclaration, {
    type: myAdditionalScalar
  })], d`
      const myScalar = z.string().max(10)
      const myAdditionalScalar = myScalar.min(5)
    `);
});
it("works with unknown scalars", async () => {
  const runner = await createTestRunner();
  const {
    unknownScalar
  } = await runner.compile(`
      @test scalar unknownScalar;
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: unknownScalar
  }), "z.any()");
});
it("emits docs", async () => {
  const runner = await createTestRunner();
  const {
    unknownScalar
  } = await runner.compile(`
      /** An unknown scalar */
      @test scalar unknownScalar;
    `);
  expectRender(runner.program, _$createComponent(ZodSchema, {
    type: unknownScalar
  }), 'z.any().describe("An unknown scalar")');
});
//# sourceMappingURL=scalars.test.js.map