import { router } from '@inertiajs/react';
import { useRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";


export default function ProgressBar({
    containerStyle,
}: {
    containerStyle?: React.CSSProperties;
}) {
    const progressBar = useRef<LoadingBarRef>(null)

    router.on('start', () => progressBar.current?.continuousStart());

    router.on('progress', (event: CustomEvent) => {
        if (event.detail.progress.percentage) {
            progressBar.current?.increase(event.detail.progress.percentage);
        }
    });

    router.on('finish', () => progressBar.current?.complete());

    return <LoadingBar ref={progressBar} className="!bg-primary" style={{ viewTransitionName: 'navigation-progress-bar' }} containerStyle={containerStyle} />;
}