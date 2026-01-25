export declare const $lib: import("@typespec/compiler").TypeSpecLibrary<{
    [code: string]: import("@typespec/compiler").DiagnosticMessages;
}, Record<string, any>, never>;
export declare const reportDiagnostic: <C extends string | number, M extends keyof {
    [code: string]: import("@typespec/compiler").DiagnosticMessages;
}[C]>(program: import("@typespec/compiler").Program, diag: import("@typespec/compiler").DiagnosticReport<{
    [code: string]: import("@typespec/compiler").DiagnosticMessages;
}, C, M>) => void, createDiagnostic: <C extends string | number, M extends keyof {
    [code: string]: import("@typespec/compiler").DiagnosticMessages;
}[C]>(diag: import("@typespec/compiler").DiagnosticReport<{
    [code: string]: import("@typespec/compiler").DiagnosticMessages;
}, C, M>) => import("@typespec/compiler").Diagnostic;
//# sourceMappingURL=lib.d.ts.map