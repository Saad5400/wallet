import React from 'react';

import ProgressBar from './ProgressBar';
import ViewTransition from './ViewTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import AndroidMockup from '@/components/AndroidMockup';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const isMobile = useIsMobile();

    return (
        <>
            <ViewTransition />
            {isMobile ?
                <>
                    <ProgressBar />
                    {children}
                </>
                :
                <div className='flex justify-center items-center p-16 min-h-screen bg-slate-700' style={{ viewTransitionName: 'phone-mockup' }}>
                    <AndroidMockup screenWidth={350} className='drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]' statusbarColor='#202020' frameColor='#202020' noRoundedScreen={true}>
                        {children}
                    </AndroidMockup>
                </div>
            }
        </>
    );
}
