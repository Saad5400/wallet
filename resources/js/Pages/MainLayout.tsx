import React from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import AndroidMockup from '@/components/mockup/AndroidMockup';

export default function MainLayout({ children }: { children: React.ReactNode }): JSX.Element {
    const isMobile = useIsMobile();

    return (
        <>
            {isMobile ?
                <div className="relative flex-grow w-full h-screen" id='actual-content'>
                    {children}
                </div>
                :
                <div className='flex items-center justify-center min-h-screen p-16 bg-slate-700'>
                    <AndroidMockup screenWidth={350} className='relative drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]'
                        statusbarColor='#202020' frameColor='#202020' noRoundedScreen={true}>
                        <div className="relative flex-grow w-full h-full" id='actual-content'>
                            {children}
                        </div>
                    </AndroidMockup>
                </div>
            }
        </>
    );
}
