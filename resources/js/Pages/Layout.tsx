import { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { router } from "@inertiajs/react";
import { cn } from '@/lib/utils';

export default function Default({ children }: PropsWithChildren) {

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        router.on('start', () => setLoading(true))
        router.on('finish', () => setLoading(false))
    }, [])

    const transitionClass = useMemo(() => (loading ? 'fade-out' : 'fade-in'), [loading])

    return (
        <div className={cn(transitionClass)}>
            {children}
        </div>
    );
}
