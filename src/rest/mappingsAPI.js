const API_URL = process.env.REACT_APP_API_GATEWAY + '/mappings';

export function postMapping(mappingName, rules) {
    return fetch(`${API_URL}/${mappingName}`, {
        method: 'POST',
        // TODO Const
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({ name: mappingName, rules }),
    });
}

export function getMappings() {
    return fetch(`${API_URL}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
    });
}

export function deleteMapping(mappingName) {
    return fetch(`${API_URL}/${mappingName}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
    });
}

export async function renameMapping(nameToReplace, newName) {
    return fetch(`${API_URL}/rename/${nameToReplace}/to/${newName}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
    });
}

export async function copyMapping(originalName, copyName) {
    return fetch(`${API_URL}/copy/${originalName}/to/${copyName}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'default',
    });
}
