import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/Email/Layout';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <Layout>
            <Head title="هلا" />
            <form className='contents'>
                <h5 className='text-center'>
                    الدخول
                </h5>

                <div className='flex flex-col items-start'>
                    <Button size={'wide'}>
                        إرسال رمز التحقق
                    </Button>
                    <Button variant={'link'}>
                        <Link href={route('welcome')}>
                            الرجوع
                        </Link>
                    </Button>
                </div>
            </form>
        </Layout>
    );
}
