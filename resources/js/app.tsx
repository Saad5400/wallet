import '../css/app.css';
import '../css/animations.css';
import './bootstrap';

import {createInertiaApp} from '@inertiajs/react';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {createRoot, hydrateRoot} from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// if (document.startViewTransition) {
//     document.addEventListener("inertia:start", () => {
//         document.startViewTransition(() => {
//             return new Promise<void>((resolve) => {
//                 document.addEventListener(
//                     "inertia:finish",
//                     () => {
//                         setTimeout(() => {
//                             resolve();
//                         });
//                     },
//                     {once: true},
//                 );
//             });
//         });
//     });
// }

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({el, App, props}) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
            return;
        }

        createRoot(el).render(<App {...props} />);
    },
    progress: false,
});
