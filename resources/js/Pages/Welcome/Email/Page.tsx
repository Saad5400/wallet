import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/Email/Layout';
import { Head, Link } from '@inertiajs/react';
import { Icon } from "@iconify/react";

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
                        <Link className='flex flex-row items-center gap-2' href={route('welcome')}>
                            <Icon icon='line-md:log-out' className='size-4' />
                            الرجوع
                        </Link>
                    </Button>
                </div>
            </form>
        </Layout>
    );
}
