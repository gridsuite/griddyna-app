export const EquipmentType = {
    GENERATOR: 'GENERATOR',
    LOAD: 'LOAD',
};
Object.freeze(EquipmentType);

export const PropertyType = {
    ENUM: 'ENUM',
    STRING: 'STRING',
    BOOLEAN: 'BOOLEAN',
    NUMBER: 'NUMBER',
};
Object.freeze(PropertyType);

export const EquipmentProperties = {
    GENERATOR: [
        {
            name: 'energySource',
            type: PropertyType.ENUM,
            values: ['OTHER', 'HYDRO'],
        },
        {
            name: 'id',
            type: PropertyType.STRING,
        },
        {
            name: 'name',
            type: PropertyType.STRING,
        },
        {
            name: 'minP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'maxP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'voltageRegulatorOn',
            type: PropertyType.BOOLEAN,
        },
        {
            name: 'targetP',
            type: PropertyType.NUMBER,
        },
        {
            name: 'targetV',
            type: PropertyType.NUMBER,
        },
        {
            name: 'targetQ',
            type: PropertyType.NUMBER,
        },
        {
            name: 'p',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q',
            type: PropertyType.NUMBER,
        },
    ],
    LOAD: [
        {
            name: 'loadType',
            type: PropertyType.ENUM,
            values: ['UNDEFINED'],
        },
        {
            name: 'id',
            type: PropertyType.STRING,
        },
        {
            name: 'name',
            type: PropertyType.STRING,
        },
        {
            name: 'p0',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q0',
            type: PropertyType.NUMBER,
        },
        {
            name: 'p',
            type: PropertyType.NUMBER,
        },
        {
            name: 'q',
            type: PropertyType.NUMBER,
        },
    ],
};
Object.freeze(EquipmentProperties);
