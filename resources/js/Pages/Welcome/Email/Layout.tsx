import { PropsWithChildren } from 'react';
import Layout from '@/Pages/Welcome/Layout';

export default function Default({ children }: PropsWithChildren) {
    return (
        <Layout>
            {children}
        </Layout>
    );
}
