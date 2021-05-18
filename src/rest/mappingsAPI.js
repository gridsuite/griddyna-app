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
