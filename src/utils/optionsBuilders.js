import {
    BaseOperands,
    EnumOperands,
    NumberOperands,
    StringOperands,
} from '../constants/operands';
import {
    PropertyType,
    EquipmentType,
    EquipmentProperties,
} from '../constants/equipmentDefinition';

export function getEquipmentTypesOptions() {
    return Object.keys(EquipmentType).map((key) => {
        const type = EquipmentType[key];
        // TODO intl
        return { value: type, label: type };
    });
}

// TODO intl
export function getOperandsOptions(propertyType) {
    switch (propertyType) {
        case PropertyType.BOOLEAN:
            return [
                {
                    value: BaseOperands.EQUALS,
                    label: '=',
                },
                // Since choices are always True/False, having both is redundant
                // {
                //     value: BaseOperands.NOT_EQUALS,
                //     label: '!=',
                // },
            ];
        case PropertyType.ENUM:
            return [
                {
                    value: EnumOperands.EQUALS,
                    label: '=',
                },
                {
                    value: EnumOperands.NOT_EQUALS,
                    label: '!=',
                },
                {
                    value: EnumOperands.IN,
                    label: 'is in',
                },
                {
                    value: EnumOperands.NOT_IN,
                    label: 'is not in',
                },
            ];
        case PropertyType.NUMBER:
            return [
                {
                    value: NumberOperands.LOWER,
                    label: '<',
                },
                {
                    value: NumberOperands.LOWER_OR_EQUALS,
                    label: '<=',
                },
                {
                    value: NumberOperands.EQUALS,
                    label: '=',
                },
                {
                    value: NumberOperands.NOT_EQUALS,
                    label: '<>',
                },
                {
                    value: NumberOperands.HIGHER_OR_EQUALS,
                    label: '>=',
                },
                {
                    value: NumberOperands.HIGHER,
                    label: '>',
                },
            ];
        case PropertyType.STRING:
            return [
                {
                    value: StringOperands.EQUALS,
                    label: '=',
                },
                {
                    value: StringOperands.NOT_EQUALS,
                    label: '!=',
                },
                {
                    value: StringOperands.INCLUDES,
                    label: 'includes',
                },
                {
                    value: StringOperands.STARTS_WITH,
                    label: 'starts with',
                },
                {
                    value: StringOperands.ENDS_WITH,
                    label: 'ends with',
                },
            ];
        default:
            return [];
    }
}

// TODO Add label here for translations
export function getPropertiesOptions(type) {
    return EquipmentProperties[type].map((property) => ({
        label: property.name,
        value: property.name,
    }));
}

export function getModelsOptions(models) {
    return models.map((model) => ({
        label: model.name,
        value: model.name,
    }));
}
