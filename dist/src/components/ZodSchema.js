import { memo as _$memo, createComponent as _$createComponent } from "@alloy-js/core/jsx-runtime";
import { refkey } from "@alloy-js/core";
import { MemberExpression } from "@alloy-js/typescript";
import { useTsp } from "@typespec/emitter-framework";
import { refkeySym, shouldReference } from "../utils.js";
import { zodBaseSchemaParts } from "../zodBaseSchema.js";
import { zodConstraintsParts } from "../zodConstraintsParts.js";
import { zodDescriptionParts } from "../zodDescriptionParts.js";
import { zodMemberParts } from "../zodMemberParts.js";
import { ZodCustomTypeComponent } from "./ZodCustomTypeComponent.js";
/**
 * Component that translates a TypeSpec type into the Zod type
 */
export function ZodSchema(props) {
  const {
    $
  } = useTsp();
  if (!props.nested) {
    // we are making a declaration
    return _$createComponent(MemberExpression, {
      get children() {
        return [_$memo(() => zodBaseSchemaParts(props.type)), _$memo(() => zodConstraintsParts(props.type)), _$memo(() => zodDescriptionParts(props.type))];
      }
    });
  }

  // we are in reference context
  const {
    member,
    type
  } = $.modelProperty.is(props.type) ? {
    member: props.type,
    type: props.type.type
  } : {
    type: props.type
  };
  if (shouldReference($.program, type)) {
    return _$createComponent(ZodCustomTypeComponent, {
      type: type,
      member: member,
      reference: true,
      get children() {
        return _$createComponent(MemberExpression, {
          get children() {
            return [_$createComponent(MemberExpression.Part, {
              get refkey() {
                return refkey(type, refkeySym);
              }
            }), _$memo(() => zodConstraintsParts(type, member)), _$memo(() => zodMemberParts(member)), _$memo(() => zodDescriptionParts(type, member))];
          }
        });
      }
    });
  }
  return _$createComponent(ZodCustomTypeComponent, {
    type: type,
    member: member,
    reference: true,
    get children() {
      return _$createComponent(MemberExpression, {
        get children() {
          return [_$memo(() => zodBaseSchemaParts(type)), _$memo(() => zodConstraintsParts(type, member)), _$memo(() => zodMemberParts(member)), _$memo(() => zodDescriptionParts(type, member))];
        }
      });
    }
  });
}
//# sourceMappingURL=ZodSchema.js.map