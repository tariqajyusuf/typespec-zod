import { createComponent as _$createComponent, memo as _$memo } from "@alloy-js/core/jsx-runtime";
import { FunctionCallExpression, MemberExpression } from "@alloy-js/typescript";
import { $ } from "@typespec/compiler/typekit";
import { SCCSet } from "@typespec/emitter-framework";
import { getEmitOptionsForType } from "./context/zod-options.js";
import { zod } from "./external-packages/zod.js";
export const refkeySym = Symbol.for("typespec-zod.refkey");

/**
 * Returns true if the given type is a declaration or an instantiation of a
 * declaration.
 */
export function isDeclaration(program, type) {
  switch (type.kind) {
    case "Namespace":
    case "Interface":
    case "Operation":
    case "EnumMember":
      // TODO: this should reference the enum member via
      // target.enum.Name
      return false;
    case "UnionVariant":
      return false;
    case "Model":
      if (($(program).array.is(type) || $(program).record.is(type)) && isBuiltIn(program, type)) {
        return false;
      }
      return Boolean(type.name);
    case "Union":
      return Boolean(type.name);
    case "Enum":
      return true;
    case "Scalar":
      return true;
    default:
      return false;
  }
}

// typekit doesn't consider things which have properties as records
// even though they are?
export function isRecord(program, type) {
  return type.kind === "Model" && !!type.indexer && type.indexer.key === $(program).builtin.string;
}
export function shouldReference(program, type, options) {
  return isDeclaration(program, type) && !isBuiltIn(program, type) && (!options || !getEmitOptionsForType(program, type, options?.customEmit)?.noDeclaration);
}
export function isBuiltIn(program, type) {
  if (type.kind === "ModelProperty" && type.model) {
    type = type.model;
  }
  if (!("namespace" in type) || type.namespace === undefined) {
    return false;
  }
  const globalNs = program.getGlobalNamespaceType();
  let tln = type.namespace;
  if (tln === globalNs) {
    return false;
  }
  while (tln.namespace !== globalNs) {
    tln = tln.namespace;
  }
  return tln === globalNs.namespaces.get("TypeSpec");
}
export function newTopologicalTypeCollector(program) {
  const types = new SCCSet(referencedTypes);
  function referencedTypes(type) {
    switch (type.kind) {
      case "Model":
        return [...(type.baseModel ? [type.baseModel] : []), ...(type.indexer ? [type.indexer.key, type.indexer.value] : []), ...[...type.properties.values()].map(p => p.type)];
      case "Union":
        return [...type.variants.values()].map(v => v.kind === "UnionVariant" ? v.type : v);
      case "UnionVariant":
        return [type.type];
      case "Interface":
        return [...type.operations.values()];
      case "Operation":
        return [type.parameters, type.returnType];
      case "Enum":
        return [];
      case "Scalar":
        return type.baseScalar ? [type.baseScalar] : [];
      case "Tuple":
        return type.values;
      case "Namespace":
        return [...type.operations.values(), ...type.scalars.values(), ...type.models.values(), ...type.enums.values(), ...type.interfaces.values(), ...type.namespaces.values()];
      default:
        return [];
    }
  }
  return {
    collectType(type) {
      if (shouldReference(program, type)) {
        types.add(type);
      }
    },
    get types() {
      return types.items;
    }
  };
}
export function call(target, ...args) {
  return _$createComponent(FunctionCallExpression, {
    target: target,
    args: args
  });
}
export function memberExpr(...parts) {
  return _$createComponent(MemberExpression, {
    children: parts
  });
}
export function zodMemberExpr(...parts) {
  return memberExpr(refkeyPart(zod.z), ...parts);
}
export function idPart(id) {
  return _$createComponent(MemberExpression.Part, {
    id: id
  });
}
export function refkeyPart(refkey) {
  return _$createComponent(MemberExpression.Part, {
    refkey: refkey
  });
}
export function callPart(target, ...args) {
  return _$createComponent(MemberExpression, {
    get children() {
      return [_$memo(() => typeof target === "string" ? idPart(target) : refkeyPart(target)), _$createComponent(MemberExpression.Part, {
        args: args
      }), ";"];
    }
  });
}
//# sourceMappingURL=utils.js.map