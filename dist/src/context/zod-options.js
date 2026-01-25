import { createContext, useContext } from "@alloy-js/core";
import { $ } from "@typespec/compiler/typekit";
import { isBuiltIn } from "../utils.js";
const getEmitOptionsForTypeSym = Symbol.for("typespec-zod:getEmitOptionsForType");
const getEmitOptionsForTypeKindSym = Symbol.for("typespec-zod:getEmitOptionsForTypeKind");
export const ZodCustomEmitOptions = function () {
  return new ZodCustomEmitOptionsClass();
};
export class ZodCustomEmitOptionsClass {
  #typeEmitOptions = new Map();
  #typeKindEmitOptions = new Map();
  forType(type, options) {
    this.#typeEmitOptions.set(type, options);
    return this;
  }
  forTypeKind(typeKind, options) {
    this.#typeKindEmitOptions.set(typeKind, options);
    return this;
  }

  /**
   * @internal
   */
  [getEmitOptionsForTypeSym](program, type) {
    let options = this.#typeEmitOptions.get(type);
    if (options || !$(program).scalar.is(type) || isBuiltIn(program, type)) {
      return options;
    }

    // have a scalar, it's not a built-in scalar, and didn't find options, so
    // see if we have options for a base scalar.
    let currentScalar = type;
    while (currentScalar && !isBuiltIn(program, currentScalar) && !this.#typeEmitOptions.has(currentScalar)) {
      currentScalar = currentScalar?.baseScalar;
    }
    if (!currentScalar) {
      return undefined;
    }
    return this.#typeEmitOptions.get(currentScalar);
  }

  /**
   * @internal
   */
  [getEmitOptionsForTypeKindSym](program, typeKind) {
    return this.#typeKindEmitOptions.get(typeKind);
  }
}
/**
 * Context for setting Zod options that control how Zod schemas are rendered.
 */
export const ZodOptionsContext = createContext({});
export function useZodOptions() {
  return useContext(ZodOptionsContext);
}
export function getEmitOptionsForType(program, type, options) {
  return options?.[getEmitOptionsForTypeSym](program, type);
}
export function getEmitOptionsForTypeKind(program, typeKind, options) {
  return options?.[getEmitOptionsForTypeKindSym](program, typeKind);
}
//# sourceMappingURL=zod-options.js.map