import { PropsWithChildren } from 'react';
import MainLayout from '@/Pages/MainLayout';

/**
 * WelcomeLayout Component
 *
 * Wraps the content of the welcome page within the MainLayout and applies
 * specific styling for centering and spacing.
 *
 * @param {PropsWithChildren} props - Component props containing the children elements.
 * @returns {JSX.Element} The rendered WelcomeLayout component.
 */
export default function WelcomeLayout({ children }: PropsWithChildren): JSX.Element {
    return (
        <MainLayout>
            <div className='bg-background flex flex-col items-center justify-center h-fit min-h-screen md:min-h-full gap-4 p-4'>
                {children}
            </div>
        </MainLayout>
    );
}
