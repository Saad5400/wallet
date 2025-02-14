import { PropsWithChildren } from 'react';
import Layout from '@/Pages/Welcome/Layout';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
