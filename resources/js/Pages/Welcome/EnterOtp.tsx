import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import WelcomeLogo from './WelcomeLogo';

export default function Page({ email = '' }) {
    const [otpContainer] = useAutoAnimate()

    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route('welcome.validateOtp'));
    };

    useEffect(clearErrors, [isDirty]);

    return (
        <Layout>
            <Head title="هلا" />
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                <p className='text-muted' style={{ viewTransitionName: 'welcome-otp-info' }}>
                    تم إرسال رمز التحقق إلى <span className='text-foreground'>{email}</span>
                </p>
                <div ref={otpContainer} className='flex flex-col gap-2'>
                    <Label htmlFor='otp' className='self-start' style={{ viewTransitionName: 'welcome-email-label' }}>
                        رمز التحقق
                    </Label>
                    <div dir='ltr' className='w-80' style={{ viewTransitionName: 'welcome-email-input' }}>
                        <InputOTP
                            className='w-full'
                            maxLength={6}
                            id='otp'
                            name='otp'
                            value={data.otp}
                            onChange={(e) => setData('otp', e)}
                        >
                            <InputOTPGroup className='w-full'>
                                <InputOTPSlot index={0} className='w-full' />
                                <InputOTPSlot index={1} className='w-full' />
                                <InputOTPSlot index={2} className='w-full' />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className='w-full'>
                                <InputOTPSlot index={3} className='w-full' />
                                <InputOTPSlot index={4} className='w-full' />
                                <InputOTPSlot index={5} className='w-full' />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {errors.otp && <small className='self-end text-destructive'>{errors.otp}</small>}
                </div>


                <div className='flex flex-col items-start'>
                    <Button size={'wide'} disabled={processing} style={{ viewTransitionName: 'welcome-continue-button' }}>
                        {processing ?
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                            :
                            <>
                                تأكيد الرمز
                                <Icon icon='line-md:security' className='size-4' />
                            </>
                        }
                    </Button>
                    <Button asChild variant={'link'}>
                        <Link className='flex flex-row items-center gap-2' href={route('welcome.enterEmail')} style={{ viewTransitionName: 'welcome-back-button' }}>
                            <Icon icon='line-md:log-out' className='size-4' />
                            تعديل البريد الإلكتروني
                        </Link>
                    </Button>
                </div>
            </form>
        </Layout>
    );
}
