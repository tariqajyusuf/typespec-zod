import { getFormat, getPattern } from "@typespec/compiler";
import { useTsp } from "@typespec/emitter-framework";
import { callPart, shouldReference } from "./utils.js";
export function zodConstraintsParts(type, member) {
  const {
    $
  } = useTsp();
  let constraintParts = [];
  if ($.scalar.extendsNumeric(type)) {
    constraintParts = numericConstraintsParts($, type, member);
  } else if ($.scalar.extendsString(type)) {
    constraintParts = stringConstraints($, type, member);
  } else if ($.scalar.extendsUtcDateTime(type) || $.scalar.extendsOffsetDateTime(type) || $.scalar.extendsDuration(type)) {
    const encoding = $.scalar.getEncoding(type);
    if (encoding === undefined) {
      constraintParts = [];
    } else {
      constraintParts = numericConstraintsToParts(intrinsicNumericConstraints($, encoding.type));
    }
  } else if ($.array.is(type)) {
    constraintParts = arrayConstraints($, type, member);
  }
  return constraintParts;
}
function stringConstraints($, type, member) {
  const sources = getDecoratorSources($, type, member);
  const constraints = {};
  for (const source of sources.reverse()) {
    const decoratorConstraints = {
      minLength: $.type.minLength(source),
      maxLength: $.type.maxLength(source),
      pattern: getPattern($.program, source),
      format: getFormat($.program, source)
    };
    assignStringConstraints(constraints, decoratorConstraints);
  }
  const parts = [];
  for (const [name, value] of Object.entries(constraints)) {
    if (value === undefined) {
      continue;
    }
    if (name === "minLength" && value !== 0) {
      parts.push(callPart("min", value));
    } else if (name === "maxLength" && isFinite(value)) {
      parts.push(callPart("max", value));
    } else if (name === "pattern") {
      parts.push(callPart("regex", `/${value}/`));
    } else if (name === "format") {
      parts.push(callPart(value));
    }
  }
  return parts;
}
function assignStringConstraints(target, source) {
  target.minLength = maxNumeric(target.minLength, source.minLength);
  target.maxLength = minNumeric(target.maxLength, source.maxLength);
  target.pattern = target.pattern ?? source.pattern;
  target.format = target.format ?? source.format;
}
function maxNumeric(...values) {
  const definedValues = values.filter(v => v !== undefined);
  if (definedValues.length === 0) {
    return undefined;
  }
  return definedValues.reduce((max, current) => current > max ? current : max, definedValues[0]);
}
function minNumeric(...values) {
  const definedValues = values.filter(v => v !== undefined);
  if (definedValues.length === 0) {
    return undefined;
  }
  return definedValues.reduce((min, current) => current < min ? current : min, definedValues[0]);
}

/**
 * Return sources from most specific to least specific.
 */
function getDecoratorSources($, type, member) {
  if (!$.scalar.is(type)) {
    return [...(member ? [member] : []), type];
  }
  const sources = [...(member ? [member] : []), type];
  let currentType = type.baseScalar;
  while (currentType && !shouldReference($.program, currentType)) {
    sources.push(currentType);
    currentType = currentType.baseScalar;
  }
  return sources;
}
function numericConstraintsParts($, type, member) {
  const finalConstraints = {
    min: undefined,
    minExclusive: undefined,
    max: undefined,
    maxExclusive: undefined
  };
  const sources = getDecoratorSources($, type, member);
  const intrinsicConstraints = intrinsicNumericConstraints($, type);
  const decoratorConstraints = decoratorNumericConstraints($, sources);
  if (decoratorConstraints.min !== undefined && decoratorConstraints.minExclusive !== undefined) {
    if (decoratorConstraints.minExclusive > decoratorConstraints.min) {
      delete decoratorConstraints.min;
    } else {
      delete decoratorConstraints.minExclusive;
    }
  }
  if (decoratorConstraints.max !== undefined && decoratorConstraints.maxExclusive !== undefined) {
    if (decoratorConstraints.maxExclusive < decoratorConstraints.max) {
      delete decoratorConstraints.max;
    } else {
      delete decoratorConstraints.maxExclusive;
    }
  }
  if (intrinsicConstraints.min !== undefined) {
    if (decoratorConstraints.min !== undefined) {
      if (intrinsicConstraints.min > decoratorConstraints.min) {
        delete decoratorConstraints.min;
      } else {
        delete intrinsicConstraints.min;
      }
    } else if (decoratorConstraints.minExclusive !== undefined) {
      if (intrinsicConstraints.min > decoratorConstraints.minExclusive) {
        delete decoratorConstraints.minExclusive;
      } else {
        delete intrinsicConstraints.min;
      }
    }
  }
  if (intrinsicConstraints.max !== undefined) {
    if (decoratorConstraints.max !== undefined) {
      if (intrinsicConstraints.max < decoratorConstraints.max) {
        delete decoratorConstraints.max;
      } else {
        delete intrinsicConstraints.max;
      }
    } else if (decoratorConstraints.maxExclusive !== undefined) {
      if (intrinsicConstraints.max < decoratorConstraints.maxExclusive) {
        delete decoratorConstraints.maxExclusive;
      } else {
        delete intrinsicConstraints.max;
      }
    }
  }
  assignNumericConstraints(finalConstraints, intrinsicConstraints);
  assignNumericConstraints(finalConstraints, decoratorConstraints);
  return numericConstraintsToParts(finalConstraints);
}
function numericConstraintsToParts(constraints) {
  const parts = [];
  if (constraints.safe) {
    parts.push(callPart("safe"));
  }
  for (const [name, value] of Object.entries(constraints)) {
    if (value === undefined || typeof value !== "bigint" && !Number.isFinite(value)) {
      continue;
    }
    if (name === "min" && (value === 0 || value === 0n)) {
      parts.push(callPart("nonnegative"));
      continue;
    }
    parts.push(callPart(zodNumericConstraintName(name), typeof value === "bigint" ? `${value}n` : `${value}`));
  }
  return parts;
}
function zodNumericConstraintName(name) {
  if (name === "min") {
    return "gte";
  } else if (name === "max") {
    return "lte";
  } else if (name === "minExclusive") {
    return "gt";
  } else if (name === "maxExclusive") {
    return "lt";
  } else {
    throw new Error(`Unknown constraint name: ${name}`);
  }
}
function intrinsicNumericConstraints($, type) {
  const knownType = $.scalar.getStdBase(type);
  if (!knownType) {
    return {};
  }
  if (!$.scalar.extendsNumeric(knownType)) {
    return {};
  } else if ($.scalar.extendsSafeint(knownType)) {
    return {
      safe: true
    };
  } else if ($.scalar.extendsInt8(knownType)) {
    return {
      min: -(1 << 7),
      max: (1 << 7) - 1
    };
  } else if ($.scalar.extendsInt16(knownType)) {
    return {
      min: -(1 << 15),
      max: (1 << 15) - 1
    };
  } else if ($.scalar.extendsInt32(knownType)) {
    return {
      min: Number(-(1n << 31n)),
      max: Number((1n << 31n) - 1n)
    };
  } else if ($.scalar.extendsInt64(knownType)) {
    return {
      min: -(1n << 63n),
      max: (1n << 63n) - 1n
    };
  } else if ($.scalar.extendsUint8(knownType)) {
    return {
      min: 0,
      max: (1 << 8) - 1
    };
  } else if ($.scalar.extendsUint16(knownType)) {
    return {
      min: 0,
      max: (1 << 16) - 1
    };
  } else if ($.scalar.extendsUint32(knownType)) {
    return {
      min: 0,
      max: Number((1n << 32n) - 1n)
    };
  } else if ($.scalar.extendsUint64(knownType)) {
    return {
      min: 0n,
      max: (1n << 64n) - 1n
    };
  } else if ($.scalar.extendsFloat32(knownType)) {
    return {
      min: -3.4028235e38,
      max: 3.4028235e38
    };
  }
  return {};
}
function decoratorNumericConstraints($, sources) {
  const finalConstraints = {};
  for (const source of sources) {
    const decoratorConstraints = {
      max: $.type.maxValue(source),
      maxExclusive: $.type.maxValueExclusive(source),
      min: $.type.minValue(source),
      minExclusive: $.type.minValueExclusive(source)
    };
    assignNumericConstraints(finalConstraints, decoratorConstraints);
  }
  return finalConstraints;
}
function assignNumericConstraints(target, source) {
  target.min = maxNumeric(target.min, source.min);
  target.max = minNumeric(target.max, source.max);
  target.minExclusive = maxNumeric(source.minExclusive, target.minExclusive);
  target.maxExclusive = minNumeric(source.maxExclusive, target.maxExclusive);
  target.safe = target.safe ?? source.safe;
}
function arrayConstraints($, type, member) {
  const sources = getDecoratorSources($, type, member);
  const constraints = {
    minItems: $.type.minItems(type),
    maxItems: $.type.maxItems(type)
  };
  const memberConstraints = {
    minItems: member && $.type.minItems(member),
    maxItems: member && $.type.maxItems(member)
  };
  assignArrayConstraints(constraints, memberConstraints);
  const parts = [];
  if (constraints.minItems && constraints.minItems > 0) {
    parts.push(callPart("min", constraints.minItems));
  }
  if (constraints.maxItems && constraints.maxItems > 0) {
    parts.push(callPart("max", constraints.maxItems));
  }
  return parts;
}
function assignArrayConstraints(target, source) {
  target.minItems = maxNumeric(target.minItems, source.minItems);
  target.maxItems = minNumeric(target.maxItems, source.maxItems);
}
//# sourceMappingURL=zodConstraintsParts.js.map