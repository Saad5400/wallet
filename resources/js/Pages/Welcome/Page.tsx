import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/Layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <Layout>
            <Head title="هلا" />
            <img src='/favicon.webp' className='rounded-4xl size-32' />
            <h4>
                محفظتنا
            </h4>
            <p className='text-muted'>
                تتبع المصاريف <span className='text-foreground'>المشتركة</span> بين الأصدقاء والعائلة
            </p>
            <img src='/images/hero.svg' alt='محفظتنا' />
            <Button asChild size={'wide'}>
                <Link href={route('welcome.email')}>
                    ابدأ الآن
                </Link>
            </Button>
            <small className='px-8 text-center text-muted'>
                بالضغط على الزر أعلاه، أنت توافق على <span className='text-foreground'>شروط الاستخدام</span> و<span className='text-foreground'>سياسة الخصوصية</span>
            </small>
        </Layout>
    );
}
