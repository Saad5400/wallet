import { usePage } from '@inertiajs/react'

export default function tenantRoute(routeName: string): string {
    const { auth } = usePage().props;

    // @ts-ignore
    return route(routeName, auth.tenant.id);
}