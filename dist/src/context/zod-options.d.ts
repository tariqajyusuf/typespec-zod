import { Children, ComponentContext, ComponentDefinition } from "@alloy-js/core";
import { ObjectPropertyProps, VarDeclarationProps } from "@alloy-js/typescript";
import { Enum, EnumMember, Model, ModelProperty, Program, Scalar, Type, Union, UnionVariant } from "@typespec/compiler";
declare const getEmitOptionsForTypeSym: unique symbol;
declare const getEmitOptionsForTypeKindSym: unique symbol;
export type ZodCustomEmitOptions = ZodCustomEmitOptionsClass;
export declare const ZodCustomEmitOptions: {
    new (): ZodCustomEmitOptionsClass;
    (): ZodCustomEmitOptionsClass;
};
export declare class ZodCustomEmitOptionsClass {
    #private;
    forType<const T extends Type>(type: T, options: ZodCustomEmitOptionsBase<T>): this;
    forTypeKind<const TKind extends Type["kind"]>(typeKind: TKind, options: ZodCustomEmitOptionsBase<Extract<Type, {
        kind: TKind;
    }>>): this;
    /**
     * @internal
     */
    [getEmitOptionsForTypeSym](program: Program, type: Type): ZodCustomEmitOptionsBase<any> | undefined;
    /**
     * @internal
     */
    [getEmitOptionsForTypeKindSym](program: Program, typeKind: Type["kind"]): ZodCustomEmitOptionsBase<any> | undefined;
}
export interface ZodCustomEmitPropsBase<TCustomType extends Type> {
    /**
     * The TypeSpec type to render.
     */
    type: TCustomType;
    /**
     * The default emitted output for this type.
     */
    default: Children;
    /**
     * The default base schema parts for this type, e.g. `z.string()`. Place
     * inside a MemberExpression component.
     */
    baseSchemaParts: () => Children;
    /**
     * The default constraint parts for this type, e.g. `min(1).max(10)`. Place
     * inside a member expression component.
     */
    constraintParts: () => Children;
    /**
     * The default description parts for this type, e.g. `describe("docs"). Place
     * inside a member expression component.
     *
     */
    descriptionParts: () => Children;
}
export type CustomTypeToProps<TCustomType extends Type> = TCustomType extends ModelProperty ? ObjectPropertyProps : TCustomType extends EnumMember ? {} : TCustomType extends UnionVariant ? {} : TCustomType extends Model | Scalar | Union | Enum ? VarDeclarationProps : VarDeclarationProps | ObjectPropertyProps;
export interface ZodCustomEmitReferenceProps<TCustomType extends Type> extends ZodCustomEmitPropsBase<TCustomType> {
    /**
     * The member this type is referenced from, if any. This member may contain
     * additional metadata that should be represented in the emitted output.
     */
    member?: ModelProperty;
    /**
     * The default member parts for this type, e.g. `optional().default(42)`.
     * Place inside a member expression component.
     */
    memberParts: () => Children;
}
export interface ZodCustomEmitDeclareProps<TCustomType extends Type> extends ZodCustomEmitPropsBase<TCustomType> {
    Declaration: ComponentDefinition<CustomTypeToProps<TCustomType>>;
    declarationProps: CustomTypeToProps<TCustomType>;
}
export type ZodCustomDeclarationComponent<TCustomType extends Type> = ComponentDefinition<ZodCustomEmitDeclareProps<TCustomType>>;
export type ZodCustomReferenceComponent<TCustomType extends Type> = ComponentDefinition<ZodCustomEmitReferenceProps<TCustomType>>;
export interface ZodCustomEmitOptionsBase<TCustomType extends Type> {
    declare?: ZodCustomDeclarationComponent<TCustomType>;
    reference?: ZodCustomReferenceComponent<TCustomType>;
    noDeclaration?: boolean;
}
export interface ZodOptionsContext {
    customEmit?: ZodCustomEmitOptions;
}
/**
 * Context for setting Zod options that control how Zod schemas are rendered.
 */
export declare const ZodOptionsContext: ComponentContext<ZodOptionsContext>;
export declare function useZodOptions(): ZodOptionsContext;
export declare function getEmitOptionsForType(program: Program, type: Type, options?: ZodCustomEmitOptions): ZodCustomEmitOptionsBase<any> | undefined;
export declare function getEmitOptionsForTypeKind(program: Program, typeKind: Type["kind"], options?: ZodCustomEmitOptions): ZodCustomEmitOptionsBase<any> | undefined;
export {};
//# sourceMappingURL=zod-options.d.ts.map