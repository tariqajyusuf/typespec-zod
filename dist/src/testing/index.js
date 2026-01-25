import { createTestLibrary, findTestPackageRoot } from "@typespec/compiler/testing";
export const TypeSpecZodTestLibrary = createTestLibrary({
  name: "typespec-zod",
  packageRoot: await findTestPackageRoot(import.meta.url)
});
//# sourceMappingURL=index.js.map