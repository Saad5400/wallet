import React from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import AndroidMockup from '@/components/mockup/AndroidMockup';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const isMobile = useIsMobile();

    return (
        <>
            {isMobile ?
                <div className="relative h-full w-full" id='actual-content'>
                    {children}
                </div>
                :
                <div className='flex justify-center items-center p-16 min-h-screen bg-slate-700'
                    style={{ viewTransitionName: 'phone-mockup' }}>
                    <AndroidMockup screenWidth={350} className='relative drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
                        statusbarColor='#202020' frameColor='#202020' noRoundedScreen={true}>
                        <div className="relative h-full w-full" id='actual-content'>
                            {children}
                        </div>
                    </AndroidMockup>
                </div>
            }
        </>
    );
}
