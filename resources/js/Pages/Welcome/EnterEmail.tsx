import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import WelcomeLogo from './WelcomeLogo';

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

    useEffect(() => {
        clearErrors();
        console.log('isDirty', isDirty);
    }, [isDirty]);

    return (
        <Layout>
            <Head title="الدخول" />
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                <div ref={emailContainer} className='flex flex-col gap-2'>
                    <Label htmlFor='email' className='self-start' style={{ viewTransitionName: 'welcome-email-label' }}>
                        البريد الإلكتروني
                    </Label>
                    <Input
                        style={{ viewTransitionName: 'welcome-email-input' }}
                        id='email'
                        name='email'
                        // type='email'
                        // required
                        dir='ltr'
                        placeholder='example@xyz.com'
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <small className='self-end text-destructive'>{errors.email}</small>}
                </div>

                <div className='flex flex-col items-start'>
                    <Button size={'wide'} disabled={processing} style={{ viewTransitionName: 'welcome-continue-button' }}>
                        {processing ?
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                            :
                            <>
                                إرسال رمز التحقق
                                <Icon icon='line-md:telegram' className='size-4' />
                            </>
                        }
                    </Button>
                    <Button asChild variant={'link'} style={{ viewTransitionName: 'welcome-back-button' }}>
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
