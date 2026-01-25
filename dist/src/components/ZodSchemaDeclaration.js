import { createComponent as _$createComponent, mergeProps as _$mergeProps } from "@alloy-js/core/jsx-runtime";
import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { refkeySym } from "../utils.js";
import { ZodCustomTypeComponent } from "./ZodCustomTypeComponent.js";
import { ZodSchema } from "./ZodSchema.js";
/**
 * Declare a Zod schema.
 */
export function ZodSchemaDeclaration(props) {
  const internalRk = ay.refkey(props.type, refkeySym);
  const [zodSchemaProps, varDeclProps] = ay.splitProps(props, ["type", "nested"]);
  const refkeys = [props.refkey ?? []].flat();
  refkeys.push(internalRk);
  const newProps = ay.mergeProps(varDeclProps, {
    refkey: refkeys,
    name: props.name || "name" in props.type && typeof props.type.name === "string" && props.type.name || props.type.kind
  });
  return _$createComponent(ZodCustomTypeComponent, {
    declare: true,
    get type() {
      return props.type;
    },
    Declaration: ts.VarDeclaration,
    declarationProps: newProps,
    get children() {
      return _$createComponent(ts.VarDeclaration, _$mergeProps(newProps, {
        get children() {
          return _$createComponent(ZodSchema, zodSchemaProps);
        }
      }));
    }
  });
}
//# sourceMappingURL=ZodSchemaDeclaration.js.map