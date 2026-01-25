import { createComponent as _$createComponent, createIntrinsic as _$createIntrinsic } from "@alloy-js/core/jsx-runtime";
import * as ay from "@alloy-js/core";
import * as ts from "@alloy-js/typescript";
import { ListenerFlow, navigateProgram } from "@typespec/compiler";
import { Output, writeOutput } from "@typespec/emitter-framework";
import { ZodSchemaDeclaration } from "./components/ZodSchemaDeclaration.js";
import { zod } from "./external-packages/zod.js";
import { isBuiltIn, newTopologicalTypeCollector } from "./utils.js";
export async function $onEmit(context) {
  const types = getAllDataTypes(context.program);
  const tsNamePolicy = ts.createTSNamePolicy();
  writeOutput(context.program, _$createComponent(Output, {
    get program() {
      return context.program;
    },
    namePolicy: tsNamePolicy,
    externals: [zod],
    get children() {
      return _$createComponent(ts.SourceFile, {
        path: "models.ts",
        get children() {
          return _$createComponent(ay.For, {
            each: types,
            ender: ";",
            get joiner() {
              return [";", _$createIntrinsic("hbr", {}), _$createIntrinsic("hbr", {})];
            },
            children: type => _$createComponent(ZodSchemaDeclaration, {
              type: type,
              "export": true
            })
          });
        }
      });
    }
  }), context.emitterOutputDir);
}

/**
 * Collects all the models defined in the spec and returns them in topologically sorted order.
 * Types are ordered such that dependencies appear before the types that depend on them.
 * @returns A topologically sorted collection of all defined models in the spec
 */
function getAllDataTypes(program) {
  const collector = newTopologicalTypeCollector(program);
  navigateProgram(program, {
    namespace(n) {
      if (isBuiltIn(program, n)) {
        return ListenerFlow.NoRecursion;
      }
    },
    model: collector.collectType,
    enum: collector.collectType,
    union: collector.collectType,
    scalar: collector.collectType
  }, {
    includeTemplateDeclaration: false
  });
  return collector.types;
}
//# sourceMappingURL=emitter.js.map