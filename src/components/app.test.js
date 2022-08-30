// app.test.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import { store } from '../redux/store';

let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    container.remove();
    container = null;
});

it('renders', async () => {
    const root = createRoot(container);
    await act(async () =>
        root.render(
            <IntlProvider locale="en">
                <Provider store={store}>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </Provider>
            </IntlProvider>
        )
    );

    expect(container.textContent).toContain('GridDyna');
    act(() => {
        root.unmount();
    });
});
