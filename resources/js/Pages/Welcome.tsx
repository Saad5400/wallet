import { Button } from '@/components/ui/button';
import Layout from '@/Layouts/Layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <Layout>
            <Head title="هلا" />
            <div className='flex flex-col items-center justify-center min-h-screen gap-4 px-4 py-32'>
                <img src='/favicon.webp' className='rounded-4xl size-32' />
                <h4>
                    محفظتنا
                </h4>
                <p className='text-muted'>
                    تتبع مصاريفك ومصاريف عائلتك من مكان واحد
                </p>
                <img src='/images/hero.svg' alt='محفظتنا' />
                <Button size={'wide'}>
                    ابدأ الآن
                </Button>
            </div>
        </Layout>
    );
}
