import { Children } from "@alloy-js/core/jsx-runtime";
import { ZodCustomEmitOptions } from "../context/zod-options.js";
export interface ZodOptionsProps {
    /**
     * Provide custom component for rendering a specific TypeSpec type.
     */
    customEmit: ZodCustomEmitOptions;
    children: Children;
}
/**
 * Set ZodOptions for the children of this component.
 */
export declare function ZodOptions(props: ZodOptionsProps): Children;
//# sourceMappingURL=ZodOptions.d.ts.map