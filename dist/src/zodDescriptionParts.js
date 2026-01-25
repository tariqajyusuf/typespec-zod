import { useTsp } from "@typespec/emitter-framework";
import { callPart, isBuiltIn } from "./utils.js";
export function zodDescriptionParts(type, member) {
  const {
    $
  } = useTsp();
  const sources = [];
  if (member && !isBuiltIn($.program, member)) {
    sources.push(member);
  }
  if (!isBuiltIn($.program, type)) {
    sources.push(type);
  }
  let doc;
  for (const source of sources) {
    const sourceDoc = $.type.getDoc(source);
    if (sourceDoc) {
      doc = sourceDoc;
      break;
    }
  }
  if (doc) {
    return [callPart("describe", `"${doc.replace(/\n+/g, " ").replace(/"/g, "\"")}"`)];
  }
  return [];
}
//# sourceMappingURL=zodDescriptionParts.js.map