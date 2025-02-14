import { Button } from '@/components/ui/button';
import Layout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEventHandler, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import WelcomeLogo from './WelcomeLogo';

export default function Page() {
    const [nameContainer] = useAutoAnimate()

    const { data, setData, post, processing, clearErrors, errors, reset, isDirty } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (processing) return;

        post(route('welcome.saveProfile'));
    };

    useEffect(() => {
        clearErrors();
    }, [isDirty]);

    return (
        <Layout>
            <Head title="اكمال الحساب" />
            <WelcomeLogo className='mb-20' />
            <form className='contents' onSubmit={submit}>
                <p className='text-muted' style={{ viewTransitionName: 'welcome-info' }}>
                    آخر شيء، نحتاج نكمل معلومات حسابك
                </p>
                <div ref={nameContainer} className='flex flex-col gap-2'>
                    <Label htmlFor='name' className='self-start' style={{ viewTransitionName: 'welcome-email-label' }}>
                        الاسم
                    </Label>
                    <Input
                        style={{ viewTransitionName: 'welcome-email-input' }}
                        id='name'
                        name='name'
                        required
                        placeholder='اسم المستخدم العلني'
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                    />
                    {errors.name && <small className='self-end text-destructive'>{errors.name}</small>}
                </div>

                <div className='flex flex-col items-start'>
                    <Button size={'wide'} disabled={processing} style={{ viewTransitionName: 'welcome-continue-button' }}>
                        {processing ?
                            <Icon icon='line-md:loading-twotone-loop' className='size-4' />
                            :
                            <>
                                حفظ
                                <Icon icon='line-md:cloud-alt-upload' className='size-4' />
                            </>
                        }
                    </Button>
                </div>
            </form>
        </Layout>
    );
}
