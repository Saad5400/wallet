import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

/**
 * MainLayout Component
 *
 * This component wraps your application's content and enhances the navigation
 * experience by leveraging the experimental View Transition API (if available).
 *
 * When Inertia triggers a navigation event, this layout starts a view transition
 * that provides a smoother visual effect during page changes.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child elements to be rendered inside the layout.
 * @returns {JSX.Element} The MainLayout component.
 */
export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    useEffect(() => {
        // Check if the browser supports the experimental View Transition API.
        if (!document.startViewTransition) return;

        /**
         * Handles navigation events by starting a view transition.
         *
         * @param {CustomEvent} e - The navigation event triggered by Inertia.
         */
        const handleNavigate = (e: CustomEvent) => {
            // Start the view transition using the experimental API.
            document.startViewTransition(async () => {
                // Create a Promise that resolves when the navigation is finished.
                await new Promise<void>((resolve) => {
                    // Subscribe to the 'finish' event from the Inertia router.
                    const offFinish = router.on('finish', (e) => {
                        // Delay is required to ensure a smooth transition effect.
                        setTimeout(() => {
                            offFinish(); // Unsubscribe to avoid memory leaks.
                            resolve();   // Resolve the promise, ending the transition.
                        }, 10);
                    });
                });
            });
        };

        // Subscribe to Inertia's 'start' event to initiate the handleNavigate function on navigation.
        const offNavigate = router.on('start', handleNavigate);

        // Cleanup: Unsubscribe from the navigation event when the component unmounts.
        return () => {
            offNavigate();
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount.

    // Render the children components within the layout.
    return <>{children}</>;
}
