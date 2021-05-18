const API_URL = process.env.REACT_APP_API_GATEWAY + '/scripts';

export function convertToScript(mappingName) {
    return fetch(`${API_URL}/from/${mappingName}`, {
        method: 'GET',
        // TODO Const
        headers: {},
        mode: 'cors',
        cache: 'default',
    });
}
