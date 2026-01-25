import { Children } from "@alloy-js/core/jsx-runtime";
import { Program } from "@typespec/compiler";
export declare function expectRender(program: Program, children: Children, expected: string): void;
export declare function expectRenderPure(children: Children, expected: string): void;
export declare function createTestHost(includeHttp?: boolean): Promise<import("@typespec/compiler/testing").TestHost>;
export declare function createTestRunner(): Promise<import("@typespec/compiler/testing").BasicTestRunner>;
export declare function createEmitterTestRunner(emitterOptions?: {}, includeHttp?: boolean): Promise<import("@typespec/compiler/testing").BasicTestRunner>;
//# sourceMappingURL=utils.d.ts.map