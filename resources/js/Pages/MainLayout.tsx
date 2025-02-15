import React from 'react';
import { AndroidMockup } from "react-device-mockup";

import ProgressBar from './ProgressBar';
import ViewTransition from './ViewTransition';
import { useIsMobile } from '@/hooks/use-mobile';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const isMobile = useIsMobile();

    return isMobile ? (
        <>
            <ViewTransition />
            <ProgressBar />
            {children}
        </>
    ) : (
        <div className='flex justify-center items-center p-16 min-h-screen bg-slate-700'>
            <AndroidMockup screenWidth={350} className='drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' statusbarColor='#202020' frameColor='#202020' noRoundedScreen={true}>
                {children}
            </AndroidMockup>
        </div>
    );
}
