import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    lastRecord: Record | null;
}

export interface Tenant {
    id: string;
    name: string;
    month_start_day: number;
    accounts: Account[];
    categories: Category[];
}

export type RecordType = 'income' | 'expense' | 'transfer';

export interface Record {
    id: number;
    created_at: string | null;
    occurred_at: string;
    updated_at: string | null;
    tenant_id: string;
    user_id: number;
    account_id: number;
    category_id: number | null;
    sub_category_id: number | null;
    amount: number;
    description: string | null;
    type: RecordType;
    ignored: boolean;
}

export interface Account {
    id: number;
    created_at: string | null;
    updated_at: string | null;
    tenant_id: string;
    name: string;
    cashback_rate: number;
}

export interface Category {
    id: number;
    created_at: string | null;
    updated_at: string | null;
    tenant_id: string;
    name: string;
    type: RecordType;
    color: string | null;
    icon: string | null;
    sub_categories: SubCategory[];
}

export interface SubCategory {
    id: number;
    created_at: string | null;
    updated_at: string | null;
    tenant_id: string;
    category_id: number;
    name: string;
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
