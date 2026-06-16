/**
 * Copyright (c) 2026, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/**
 * Trigger download.
 *
 * @param blob - The file content as a Blob.
 * @param filename - The provided filename for the download.
 */
export function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Extract the filename.
 *
 * @param contentDisposition - The Content-Disposition header value.
 * @param defaultFileName - Filename to use if not found in the header.
 * @returns The resolved filename.
 */
export function extractFilename(contentDisposition: string | null, defaultFileName: string): string {
    if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) {
            return match[1];
        }
    }
    return defaultFileName;
}

/**
 * Open a file browser on-fly.
 *
 * @param accept - Accepted file types (e.g. '.json').
 * @returns A Promise resolving to the selected File.
 */
export function pickFile(accept = '.json'): Promise<File> {
    return new Promise<File>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;

        input.onchange = (event: Event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                resolve(file);
            } else {
                reject(new Error('No file selected'));
            }
        };

        input.oncancel = () => reject(new Error('File selection cancelled'));

        input.click();
    });
}

/**
 * Read a File as a text string.
 *
 * @param file - The file to read.
 * @returns A Promise resolving to the file content as a string.
 */
export function readFileAsText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => resolve(event.target?.result as string);
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsText(file);
    });
}
