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
 * Page Component
 *
 * Renders the profile completion form for setting the user's display name.
 *
 * @returns {JSX.Element} The rendered profile completion page.
 */
function Page(): JSX.Element {
    // Initialize auto-animation for the name input container.
    const [nameContainer] = useAutoAnimate();

    // Setup form state and handlers using Inertia's useForm hook.
    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        name: '',
    });

    /**
     * Handles form submission to save the profile.
     *
     * @param {React.FormEvent} e - The form submission event.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (processing) return;
        // Submit the form data to the saveProfile route.
        post(route('welcome.saveProfile'));
    };

    // Clear errors whenever form data changes.
    useEffect(() => {
        clearErrors();
    }, [isDirty]);

    return (
        <>
            {/* Set the page title */}
            <Head title="اكمال الحساب" />
            {/* Render the welcome logo */}
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                {/* Informational message */}
                <p className='text-muted'>
                    آخر شيء، نحتاج نكمل معلومات حسابك
                </p>
                {/* Container for the name input */}
                <div ref={nameContainer} className='flex flex-col gap-2'>
                    {/* Label for the name input */}
                    <Label htmlFor='name' className='self-start'>
                        الاسم
                    </Label>
                    {/* Name input field */}
                    <Input
                        id='name'
                        name='name'
                        required
                        data-testid="name-input"
                        placeholder='اسم المستخدم العلني'
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {/* Display error message for name if any */}
                    {errors.name && <small className='self-end text-destructive' data-testid="name-error">{errors.name}</small>}
                </div>
                {/* Container for the submit button */}
                <div className='flex flex-col items-start'>
                    <Button size={'wide'} disabled={processing} data-testid="submit-button">
                        {processing ? (
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                        ) : (
                            <>
                                حفظ
                                <Icon icon='line-md:cloud-alt-upload' className='size-4' />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </>
    );
}

Page.layout = (page: JSX.Element) => <Layout>{page}</Layout>;
export default Page;
