import { Model, Program, Type } from "@typespec/compiler";
import { ZodCustomEmitOptions } from "../src/index.js";
interface GenericTestDescriptor {
    program: Program;
    types: Type[];
}
interface DeclTestDescriptor {
    type?: Type;
    refType: Type;
    refContainer: Model;
    program: Program;
    reference?: string;
}
type TestDescriptor = DeclTestDescriptor | GenericTestDescriptor;
export declare function expectOptionRender(test: TestDescriptor, options: ZodCustomEmitOptions, expected: string): void;
export {};
//# sourceMappingURL=zod-options.test.d.ts.map