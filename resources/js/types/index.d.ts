import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Tenant {
    id: string;
    name: string;
    month_start_day: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        tenant: Tenant;
    };
    ziggy: Config & { location: string };
};

export interface Period {
    startDate: Dayjs;
    endDate: Dayjs;
}
