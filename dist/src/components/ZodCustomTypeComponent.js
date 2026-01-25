import { memo as _$memo, createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { useTsp } from "@typespec/emitter-framework";
import { getEmitOptionsForType, getEmitOptionsForTypeKind, useZodOptions } from "../context/zod-options.js";
import { zodBaseSchemaParts } from "../zodBaseSchema.js";
import { zodConstraintsParts } from "../zodConstraintsParts.js";
import { zodDescriptionParts } from "../zodDescriptionParts.js";
import { zodMemberParts } from "../zodMemberParts.js";
export function ZodCustomTypeComponent(props) {
  const options = useZodOptions();
  const {
    $
  } = useTsp();
  const descriptor = getEmitOptionsForType($.program, props.type, options.customEmit) ?? getEmitOptionsForTypeKind($.program, props.type.kind, options.customEmit);
  if (!descriptor) {
    return [_$memo(() => props.children)];
  }
  if ("declare" in props && props.declare && descriptor.declare) {
    const CustomComponent = descriptor.declare;
    const baseSchemaParts = () => zodBaseSchemaParts(props.type);
    const constraintParts = () => zodConstraintsParts(props.type);
    const descriptionParts = () => zodDescriptionParts(props.type);
    return _$createComponent(CustomComponent, {
      get type() {
        return props.type;
      },
      get ["default"]() {
        return props.children;
      },
      baseSchemaParts: baseSchemaParts,
      constraintParts: constraintParts,
      descriptionParts: descriptionParts,
      get declarationProps() {
        return props.declarationProps;
      },
      get Declaration() {
        return props.Declaration;
      }
    });
  } else if ("reference" in props && props.reference && descriptor.reference) {
    const CustomComponent = descriptor.reference;
    const baseSchemaParts = () => zodBaseSchemaParts(props.member ?? props.type);
    const constraintParts = () => zodConstraintsParts(props.type, props.member);
    const descriptionParts = () => zodDescriptionParts(props.type, props.member);
    const memberParts = () => zodMemberParts(props.member);
    return _$createComponent(CustomComponent, {
      get type() {
        return props.type;
      },
      get member() {
        return props.member;
      },
      get ["default"]() {
        return props.children;
      },
      baseSchemaParts: baseSchemaParts,
      constraintParts: constraintParts,
      descriptionParts: descriptionParts,
      memberParts: memberParts
    });
  }
  return [_$memo(() => props.children)];
}
//# sourceMappingURL=ZodCustomTypeComponent.js.map