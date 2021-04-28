import { EquipmentProperties } from '../constants/equipmentDefinition';

export function getProperty(equipmentType, propertyName) {
    return EquipmentProperties[equipmentType].find(
        (property) => property.name === propertyName
    );
}

export function getValuesOption(property) {
    console.log(property);
    //TODO Intl
    return property?.values?.map((value) => ({
        label: value,
        value,
    }));
}
