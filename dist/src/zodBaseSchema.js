import { createComponent as _$createComponent, memo as _$memo } from "@alloy-js/core/jsx-runtime";
import { For, refkey } from "@alloy-js/core";
import { ArrayExpression, MemberExpression, ObjectExpression, ObjectProperty } from "@alloy-js/typescript";
import { useTsp } from "@typespec/emitter-framework";
import { ZodCustomTypeComponent } from "./components/ZodCustomTypeComponent.js";
import { ZodSchema } from "./components/ZodSchema.js";
import { callPart, idPart, isDeclaration, isRecord, refkeySym, shouldReference, zodMemberExpr } from "./utils.js";

/**
 * Returns the identifier parts for the base Zod schema for a given TypeSpec
 * type.
 */
export function zodBaseSchemaParts(type) {
  const {
    $
  } = useTsp();
  switch (type.kind) {
    case "Intrinsic":
      return intrinsicBaseType(type);
    case "String":
    case "Number":
    case "Boolean":
      return literalBaseType($, type);
    case "Scalar":
      return scalarBaseType($, type);
    case "Model":
      return modelBaseType(type);
    case "Union":
      return unionBaseType(type);
    case "Enum":
      return enumBaseType(type);
    case "ModelProperty":
      return zodBaseSchemaParts(type.type);
    case "EnumMember":
      return type.value ? literalBaseType($, $.literal.create(type.value)) : literalBaseType($, $.literal.create(type.name));
    case "Tuple":
      return tupleBaseType(type);
    default:
      return zodMemberExpr(callPart("any"));
  }
}
function literalBaseType($, type) {
  switch (type.kind) {
    case "String":
      return zodMemberExpr(callPart("literal", `"${type.value}"`));
    case "Number":
    case "Boolean":
      return zodMemberExpr(callPart("literal", `${type.value}`));
  }
}
function scalarBaseType($, type) {
  if (type.baseScalar && shouldReference($.program, type.baseScalar)) {
    return _$createComponent(MemberExpression.Part, {
      get refkey() {
        return refkey(type.baseScalar, refkeySym);
      }
    });
  }
  if ($.scalar.extendsBoolean(type)) {
    return zodMemberExpr(callPart("boolean"));
  } else if ($.scalar.extendsNumeric(type)) {
    if ($.scalar.extendsInteger(type)) {
      if ($.scalar.extendsInt32(type) || $.scalar.extendsUint32(type) || $.scalar.extendsSafeint(type)) {
        return zodMemberExpr(callPart("number"), callPart("int"));
      } else {
        return zodMemberExpr(callPart("bigint"));
      }
    } else {
      // floats and such, best we can do here lacking a decimal type.
      return zodMemberExpr(callPart("number"));
    }
  } else if ($.scalar.extendsString(type)) {
    if ($.scalar.extendsUrl(type)) {
      return zodMemberExpr(callPart("string"), callPart("url"));
    }
    return zodMemberExpr(callPart("string"));
  } else if ($.scalar.extendsBytes(type)) {
    return zodMemberExpr(callPart("any"));
  } else if ($.scalar.extendsPlainDate(type)) {
    return zodMemberExpr(idPart("coerce"), callPart("date"));
  } else if ($.scalar.extendsPlainTime(type)) {
    return zodMemberExpr(callPart("string"), callPart("time"));
  } else if ($.scalar.extendsUtcDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      return zodMemberExpr(idPart("coerce"), callPart("date"));
    } else if (encoding.encoding === "unixTimestamp") {
      return scalarBaseType($, encoding.type);
    } else if (encoding.encoding === "rfc3339") {
      return zodMemberExpr(callPart("string"), callPart("datetime"));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else if ($.scalar.extendsOffsetDateTime(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      return zodMemberExpr(idPart("coerce"), callPart("date"));
    } else if (encoding.encoding === "rfc3339") {
      return zodMemberExpr(callPart("string"), callPart("datetime"));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else if ($.scalar.extendsDuration(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined || encoding.encoding === "ISO8601") {
      return zodMemberExpr(callPart("string"), callPart("duration"));
    } else {
      return scalarBaseType($, encoding.type);
    }
  } else {
    return zodMemberExpr(callPart("any"));
  }
}
function enumBaseType(type) {
  // Only the base z.enum([...])
  // We want: zodMemberExpr(callPart("enum", ...))
  const values = Array.from(type.members.values()).map(member => member.value ?? member.name);
  return zodMemberExpr(callPart("enum", _$createComponent(ArrayExpression, {
    get children() {
      return _$createComponent(For, {
        get each() {
          return type.members.values();
        },
        comma: true,
        line: true,
        children: member => _$createComponent(ZodCustomTypeComponent, {
          type: member,
          Declaration: props => props.children,
          declarationProps: {},
          declare: true,
          get children() {
            return JSON.stringify(member.value ?? member.name);
          }
        })
      });
    }
  })));
}
function tupleBaseType(type) {
  // Only the base z.tuple([...])
  // We want: zodMemberExpr(callPart("tuple", ...))
  return zodMemberExpr(callPart("tuple", _$createComponent(ArrayExpression, {
    get children() {
      return _$createComponent(For, {
        get each() {
          return type.values;
        },
        comma: true,
        line: true,
        children: item => _$createComponent(ZodSchema, {
          type: item,
          nested: true
        })
      });
    }
  })));
}
function modelBaseType(type) {
  const {
    $
  } = useTsp();
  if ($.array.is(type)) {
    return zodMemberExpr(callPart("array", _$createComponent(ZodSchema, {
      get type() {
        return type.indexer.value;
      },
      nested: true
    })));
  }
  let recordPart;
  if (isRecord($.program, type) || !!type.baseModel && isRecord($.program, type.baseModel) && !isDeclaration($.program, type.baseModel)) {
    recordPart = zodMemberExpr(callPart("record", _$createComponent(ZodSchema, {
      get type() {
        return (type.indexer ?? type.baseModel.indexer).key;
      },
      nested: true
    }), _$createComponent(ZodSchema, {
      get type() {
        return (type.indexer ?? type.baseModel.indexer).value;
      },
      nested: true
    })));
  }
  let memberPart;
  if (type.properties.size > 0) {
    const members = _$createComponent(ObjectExpression, {
      get children() {
        return _$createComponent(For, {
          get each() {
            return type.properties.values();
          },
          comma: true,
          hardline: true,
          enderPunctuation: true,
          children: prop => _$createComponent(ZodCustomTypeComponent, {
            type: prop,
            declare: true,
            Declaration: ObjectProperty,
            get declarationProps() {
              return {
                name: prop.name
              };
            },
            get children() {
              return _$createComponent(ObjectProperty, {
                get name() {
                  return prop.name;
                },
                get children() {
                  return _$createComponent(ZodSchema, {
                    type: prop,
                    nested: true
                  });
                }
              });
            }
          })
        });
      }
    });
    memberPart = zodMemberExpr(callPart("object", members));
  }
  let parts;
  if (!memberPart && !recordPart) {
    parts = zodMemberExpr(callPart("object", _$createComponent(ObjectExpression, {})));
  } else if (memberPart && recordPart) {
    parts = zodMemberExpr(callPart("intersection", memberPart, recordPart));
  } else {
    parts = memberPart ?? recordPart;
  }
  if (type.baseModel && shouldReference($.program, type.baseModel)) {
    return _$createComponent(MemberExpression, {
      get children() {
        return [_$createComponent(MemberExpression.Part, {
          get refkey() {
            return refkey(type.baseModel, refkeySym);
          }
        }), _$createComponent(MemberExpression.Part, {
          id: "merge"
        }), _$createComponent(MemberExpression.Part, {
          args: [parts]
        })];
      }
    });
  }
  return parts;
}
function unionBaseType(type) {
  const {
    $
  } = useTsp();
  const discriminated = $.union.getDiscriminatedUnion(type);
  if ($.union.isExpression(type) || !discriminated) {
    return zodMemberExpr(callPart("union", _$createComponent(ArrayExpression, {
      get children() {
        return _$createComponent(For, {
          get each() {
            return type.variants;
          },
          comma: true,
          line: true,
          children: (name, variant) => {
            return _$createComponent(ZodSchema, {
              get type() {
                return variant.type;
              },
              nested: true
            });
          }
        });
      }
    })));
  }
  const propKey = discriminated.options.discriminatorPropertyName;
  const envKey = discriminated.options.envelopePropertyName;
  const unionArgs = [`"${propKey}"`, _$createComponent(ArrayExpression, {
    get children() {
      return _$createComponent(For, {
        get each() {
          return Array.from(type.variants.values());
        },
        comma: true,
        line: true,
        children: variant => {
          if (discriminated.options.envelope === "object") {
            const envelope = $.model.create({
              properties: {
                [propKey]: $.modelProperty.create({
                  name: propKey,
                  type: $.literal.create(variant.name)
                }),
                [envKey]: $.modelProperty.create({
                  name: envKey,
                  type: variant.type
                })
              }
            });
            return _$createComponent(ZodSchema, {
              type: envelope,
              nested: true
            });
          } else {
            return _$createComponent(ZodSchema, {
              get type() {
                return variant.type;
              },
              nested: true
            });
          }
        }
      });
    }
  })];
  return zodMemberExpr(callPart("discriminatedUnion", ...unionArgs));
}
function intrinsicBaseType(type) {
  // Only the base z.null(), z.never(), etc.
  if (type.kind === "Intrinsic") {
    switch (type.name) {
      case "null":
        return zodMemberExpr(callPart("null"));
      case "never":
        return zodMemberExpr(callPart("never"));
      case "unknown":
        return zodMemberExpr(callPart("unknown"));
      case "void":
        return zodMemberExpr(callPart("void"));
      default:
        return zodMemberExpr(callPart("any"));
    }
  }
  return zodMemberExpr(callPart("any"));
}
//# sourceMappingURL=zodBaseSchema.js.map