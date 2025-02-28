import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import WelcomeLogo from './WelcomeLogo';

/**
 * EnterEmail Component
 *
 * Renders the email entry form for requesting an OTP.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.email=''] - Initial email value.
 * @returns {JSX.Element} The rendered EnterEmail component.
 */
function EnterEmail({ email = '' }: { email?: string; }): JSX.Element {
    // Initialize auto-animate for the email input container.
    const [emailContainer] = useAutoAnimate();

    // Setup form state and handlers with Inertia's useForm.
    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        email: email,
    });

    /**
     * Handle form submission to request an OTP.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const submit: FormEventHandler = (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent submission if already processing.
        if (processing) return;

        // Post the form data to the OTP request route.
        post(route('welcome.requestOtp'));
    };

    // Clear form errors when form data changes.
    useEffect(clearErrors, [isDirty]);

    return (
        <>
            {/* Set the document title */}
            <Head title="الدخول" />
            {/* Render the welcome logo */}
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                {/* Container for the email input field with auto-animation */}
                <div ref={emailContainer} className='flex flex-col gap-2'>
                    {/* Label for email input */}
                    <Label htmlFor='email' className='self-start' style={{ viewTransitionName: 'welcome-email-label' }}>
                        البريد الإلكتروني
                    </Label>
                    {/* Email input field */}
                    <Input
                        style={{ viewTransitionName: 'welcome-email-input' }}
                        id='email'
                        name='email'
                        type='email'
                        required
                        dir='ltr'
                        placeholder='example@xyz.com'
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        data-testid="email-input"
                    />
                    {/* Display validation error for email if present */}
                    {errors.email && (
                        <p className="text-sm text-destructive mt-2">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Container for action buttons */}
                <div className='flex flex-col items-start'>
                    {/* Submit button for OTP request */}
                    <Button size={'wide'} disabled={processing} style={{ viewTransitionName: 'welcome-continue-button' }} data-testid="submit-button">
                        {processing ? (
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                        ) : (
                            <>
                                إرسال رمز التحقق
                                <Icon icon='line-md:telegram' className='size-4' />
                            </>
                        )}
                    </Button>
                    {/* Link button to navigate back */}
                    <Button asChild variant={'link'} style={{ viewTransitionName: 'welcome-back-button' }}>
                        <Link className='flex flex-row items-center gap-2' href={route('welcome.index')}>
                            <Icon icon='line-md:log-out' className='size-4' />
                            الرجوع
                        </Link>
                    </Button>
                </div>
            </form>
        </>
    );
}

EnterEmail.layout = (page: JSX.Element) => <Layout>{page}</Layout>;
export default EnterEmail;
