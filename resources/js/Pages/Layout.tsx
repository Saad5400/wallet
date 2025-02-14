import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!document.startViewTransition) return;

        // When a navigation is triggered...
        const handleNavigate = (e: CustomEvent) => {
            // Check if we're navigating to a new page
            if (e.detail.visit.method === 'get')
                // Start a view transition
                document.startViewTransition(async () => {
                    // Wait until the navigation is complete by listening to the 'finish' event.
                    await new Promise<void>((resolve) => {
                        // `router.on` returns an "off" function we can call to unsubscribe.
                        const offFinish = router.on('finish', () => {
                            offFinish(); // Unsubscribe so we don't leak listeners
                            resolve();
                        });
                    });
                });
        };

        // Listen for Inertia navigation events.
        const offNavigate = router.on('start', handleNavigate);

        // Cleanup on unmount.
        return () => {
            offNavigate();
        };
    }, []);

    return <>{children}</>;
}
