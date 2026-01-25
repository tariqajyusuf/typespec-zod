import { createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { useTsp } from "@typespec/emitter-framework";
import { ValueExpression } from "@typespec/emitter-framework/typescript";
import { callPart } from "./utils.js";
export function zodMemberParts(member) {
  const {
    $
  } = useTsp();
  return [...optionalParts($, member), ...defaultParts($, member)];
}
function defaultParts($, member) {
  if (!member || !member.defaultValue) {
    return [];
  }
  return [callPart("default", [_$createComponent(ValueExpression, {
    get value() {
      return member.defaultValue;
    }
  })])];
}
function optionalParts($, member) {
  if (!member || !member.optional) {
    return [];
  }
  return [callPart("optional")];
}
//# sourceMappingURL=zodMemberParts.js.map