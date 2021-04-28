export const BaseOperands = {
    EQUALS: 'EQUALS',
    NOT_EQUALS: 'NOT_EQUALS',
};

export const StringOperands = {
    ...BaseOperands,
    INCLUDES: 'INCLUDES',
    STARTS_WITH: 'STARTS_WITH',
    ENDS_WITH: 'ENDS_WITH',
};
export const NumberOperands = {
    ...BaseOperands,
    LOWER: 'LOWER',
    LOWER_OR_EQUALS: 'LOWER_OR_EQUALS',
    HIGHER_OR_EQUALS: 'HIGHER_OR_EQUALS',
    HIGHER: 'HIGHER',
};

export const EnumOperands = {
    ...BaseOperands,
    IN: 'IN',
    NOT_IN: 'NOT_IN',
};
