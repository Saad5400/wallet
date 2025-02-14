import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'

export default function Page({ email = '' }) {
    const [emailContainer] = useAutoAnimate()

    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        email: email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route('welcome.requestOtp'));
    };

    useEffect(clearErrors, [isDirty]);

    return (
        <Layout>
            <Head title="هلا" />
            <form className='contents' onSubmit={submit}>
                <Icon icon='line-md:email' className='size-32' />

                <div ref={emailContainer} className='flex flex-col gap-2'>
                    <Label htmlFor='email' className='self-start'>
                        البريد الإلكتروني
                    </Label>
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        required
                        dir='ltr'
                        placeholder='example@xyz.com'
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <small className='self-end text-destructive'>{errors.email}</small>}
                </div>

                <div className='flex flex-col items-start'>
                    <Button size={'wide'} disabled={processing}>
                        {processing ?
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                            :
                            <>
                                إرسال رمز التحقق
                                <Icon icon='line-md:telegram' className='size-4' />
                            </>
                        }
                    </Button>
                    <Button asChild variant={'link'}>
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
