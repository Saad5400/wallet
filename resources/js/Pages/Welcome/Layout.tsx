import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 py-24'>
            {children}
        </div>
    );
}
