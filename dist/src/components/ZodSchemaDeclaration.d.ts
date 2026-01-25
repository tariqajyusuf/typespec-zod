import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ZodSchemaProps } from "./ZodSchema.jsx";
interface ZodSchemaDeclarationProps extends Omit<ts.VarDeclarationProps, "type" | "name" | "value" | "kind">, ZodSchemaProps {
    readonly name?: string;
}
/**
 * Declare a Zod schema.
 */
export declare function ZodSchemaDeclaration(props: ZodSchemaDeclarationProps): ay.Children;
export {};
//# sourceMappingURL=ZodSchemaDeclaration.d.ts.map