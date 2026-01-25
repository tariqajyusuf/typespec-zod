import { memo as _$memo, createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { ZodOptionsContext } from "../context/zod-options.js";
/**
 * Set ZodOptions for the children of this component.
 */
export function ZodOptions(props) {
  const context = {
    customEmit: props.customEmit
  };
  return _$createComponent(ZodOptionsContext.Provider, {
    value: context,
    get children() {
      return props.children;
    }
  });
}
//# sourceMappingURL=ZodOptions.js.map