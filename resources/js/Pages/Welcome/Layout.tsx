import { PropsWithChildren } from 'react';
import DefaultLayout from '@/Pages/Layout';

export default function WelcomeLayout({ children }: PropsWithChildren) {
    return (
        <DefaultLayout>
            <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 py-24'>
                {children}
            </div>
        </DefaultLayout>
    );
}
