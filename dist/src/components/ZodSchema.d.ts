import { Children } from "@alloy-js/core";
import { Type } from "@typespec/compiler";
export interface ZodSchemaProps {
    readonly type: Type;
    readonly nested?: boolean;
}
/**
 * Component that translates a TypeSpec type into the Zod type
 */
export declare function ZodSchema(props: ZodSchemaProps): Children;
//# sourceMappingURL=ZodSchema.d.ts.map