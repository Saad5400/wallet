import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link } from '@inertiajs/react';
import { Icon } from "@iconify/react";

function WelcomePage() {
    return (
        <>
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
                <Link href={route('welcome.enterEmail')}>
                    ابدأ الآن
                    <Icon icon='line-md:log-in' className='size-4' />
                </Link>
            </Button>
            <small className='px-8 text-center text-muted'>
                بالضغط على الزر أعلاه، أنت توافق على <span className='text-foreground'>شروط الاستخدام</span> و<span className='text-foreground'>سياسة الخصوصية</span>
            </small>
        </>
    );
}

WelcomePage.layout = (page: any) => <Layout children={page} />

export default WelcomePage;
