import { PropsWithChildren } from 'react';
import Layout from '@/Pages/Layout';

export default function Default({ children }: PropsWithChildren) {
    return (
        <Layout>
            <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 py-24'>
                {children}
            </div>
        </Layout>
    );
}
