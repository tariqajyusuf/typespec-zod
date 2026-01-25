import { expect, it } from "vitest";
import { createEmitterTestRunner } from "../utils.jsx";

it("emits types from imported external packages", async () => {
  const runner = await createEmitterTestRunner();

  // Set up a fake external package structure
  runner.fs.set(
    "/test/node_modules/@custom-package/spec/package.json",
    JSON.stringify({
      name: "@custom-package/spec",
      version: "1.0.0",
      tspMain: "./main.tsp"
    })
  );

  runner.fs.set(
    "/test/node_modules/@custom-package/spec/main.tsp",
    `
namespace CustomPackage {
  model SharedModel {
    id: string;
    name: string;
  }

  enum Status {
    Active,
    Inactive
  }

  scalar CustomString extends string;
}
    `
  );

  // Main file that imports from the external package with no additional definitions
  await runner.compile(`
import "@custom-package/spec";
  `);

  const { text } = await runner.program.host.readFile("typespec-zod/models.ts");

  // Should emit all types from the imported package plus the User model
  expect(text).toContain("export const sharedModel");
  expect(text).toContain("export const status");
  expect(text).toContain("export const customString");
});

it("emits types from imported local files", async () => {
  const runner = await createEmitterTestRunner();

  // Set up a local file to import
  runner.fs.set(
    "/test/lib.tsp",
    `
namespace MyLib {
  model LibModel {
    value: string;
  }

  enum LibEnum {
    One,
    Two
  }
}
    `
  );

  // Main file that imports the local file
  await runner.compile(`
import "./lib.tsp";

model MainModel {
  lib: MyLib.LibModel;
  status: MyLib.LibEnum;
}
  `);

  const { text } = await runner.program.host.readFile("typespec-zod/models.ts");

  // Should emit types from the imported file
  expect(text).toContain("export const libModel");
  expect(text).toContain("export const libEnum");
  expect(text).toContain("export const mainModel");
});

