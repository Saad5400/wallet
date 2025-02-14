import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (!document.startViewTransition) return;

        // When a navigation is triggered...
        const handleNavigate = (e: CustomEvent) => {

            // Start the view transition.
            document.startViewTransition(async () => {
                await new Promise<void>((resolve, reject) => {
                    const offFinish = router.on('finish', (e) => {
                        // Delay is required
                        setTimeout(() => {
                            offFinish(); // Unsubscribe so we don't leak listeners
                            resolve();
                        }, 10);
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
