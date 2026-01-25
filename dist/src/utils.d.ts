import { Refkey } from "@alloy-js/core";
import { Children } from "@alloy-js/core/jsx-runtime";
import { Program, Type } from "@typespec/compiler";
import { ZodOptionsContext } from "./context/zod-options.js";
export declare const refkeySym: unique symbol;
/**
 * Returns true if the given type is a declaration or an instantiation of a
 * declaration.
 */
export declare function isDeclaration(program: Program, type: Type): boolean;
export declare function isRecord(program: Program, type: Type): boolean;
export declare function shouldReference(program: Program, type: Type, options?: ZodOptionsContext): boolean;
export declare function isBuiltIn(program: Program, type: Type): boolean;
interface TypeCollector {
    collectType: (type: Type) => void;
    get types(): Type[];
}
export declare function newTopologicalTypeCollector(program: Program): TypeCollector;
export declare function call(target: string, ...args: Children[]): Children;
export declare function memberExpr(...parts: Children[]): Children;
export declare function zodMemberExpr(...parts: Children[]): Children;
export declare function idPart(id: string): Children;
export declare function refkeyPart(refkey: Refkey): Children;
export declare function callPart(target: string | Refkey, ...args: Children[]): Children;
export {};
//# sourceMappingURL=utils.d.ts.map