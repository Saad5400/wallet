import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import WelcomeLogo from './WelcomeLogo';

/**
 * Page Component
 *
 * Renders the OTP validation page, allowing users to enter the OTP sent to their email.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.email=''] - The email address to which the OTP was sent.
 * @returns {JSX.Element} The rendered OTP validation page.
 */
function EnterOtp({ email = '' }: { email?: string; }): JSX.Element {
    // Initialize auto-animate for smooth animations within the OTP container.
    const [otpContainer] = useAutoAnimate();

    // Setup form handling using Inertia's useForm hook.
    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        otp: '',
    });

    /**
     * Handle form submission for OTP validation.
     *
     * @param {React.FormEvent} e - The form event.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (processing) return;
        // Submit the form data to the OTP validation route.
        post(route('welcome.validateOtp'));
    };

    // Clear form errors when form data is modified.
    useEffect(clearErrors, [isDirty]);

    return (
        <>
            {/* Set the page title */}
            <Head title="رمز التحقق" />
            {/* Display the welcome logo */}
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                {/* Inform the user that the OTP has been sent */}
                <p className='text-muted' style={{ viewTransitionName: 'welcome-info' }}>
                    تم إرسال رمز التحقق إلى <span className='text-foreground'>{email}</span>
                </p>
                {/* OTP input container with auto-animate */}
                <div ref={otpContainer} className='flex flex-col gap-2'>
                    {/* Label for the OTP input */}
                    <Label htmlFor='otp' className='self-start' style={{ viewTransitionName: 'welcome-email-label' }}>
                        رمز التحقق
                    </Label>
                    {/* Container for OTP input groups and slots */}
                    <div dir='ltr' className='w-80' style={{ viewTransitionName: 'welcome-email-input' }}>
                        <InputOTP
                            className='w-full'
                            maxLength={6}
                            minLength={6}
                            id='otp'
                            name='otp'
                            value={data.otp}
                            required
                            onChange={(e) => setData('otp', e)}
                            data-testid="otp-input"
                        >
                            {/* First group of OTP input slots */}
                            <InputOTPGroup className='w-full'>
                                <InputOTPSlot index={0} className='w-full' />
                                <InputOTPSlot index={1} className='w-full' />
                                <InputOTPSlot index={2} className='w-full' />
                            </InputOTPGroup>
                            {/* Separator between OTP groups */}
                            <InputOTPSeparator />
                            {/* Second group of OTP input slots */}
                            <InputOTPGroup className='w-full'>
                                <InputOTPSlot index={3} className='w-full' />
                                <InputOTPSlot index={4} className='w-full' />
                                <InputOTPSlot index={5} className='w-full' />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {/* Display OTP error message if present */}
                    {errors.otp && (
                        <p className="text-sm text-red-500 mt-2" data-testid="error-message">
                            {errors.otp}
                        </p>
                    )}
                </div>
                {/* Container for action buttons */}
                <div className='flex flex-col items-start'>
                    {/* Button to submit OTP validation */}
                    <Button type="submit" size={'wide'} disabled={processing} data-testid="otp-submit-button" style={{ viewTransitionName: 'welcome-continue-button' }}>
                        {processing ? (
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                        ) : (
                            <>
                                تأكيد الرمز
                                <Icon icon='line-md:security' className='size-4' />
                            </>
                        )}
                    </Button>
                    {/* Button to navigate back to email entry for editing */}
                    <Button asChild variant={'link'}>
                        <Link className='flex flex-row items-center gap-2' href={route('welcome.enterEmail')} style={{ viewTransitionName: 'welcome-back-button' }}>
                            <Icon icon='line-md:log-out' className='size-4' />
                            تعديل البريد الإلكتروني
                        </Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

EnterOtp.layout = (page: JSX.Element) => <Layout>{page}</Layout>;
export default EnterOtp;
