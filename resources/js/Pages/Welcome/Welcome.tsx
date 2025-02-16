import { Button } from '@/components/ui/button';
import WelcomeLayout from '@/Pages/Welcome/WelcomeLayout';
import { Head, Link } from '@inertiajs/react';
import { Icon } from "@iconify/react";
import WelcomeLogo from './WelcomeLogo';

/**
 * WelcomePage Component
 *
 * Renders the welcome page of the application.
 * It includes a logo, heading, description, hero image, a call-to-action button,
 * and a disclaimer about terms of service and privacy policy.
 *
 * @returns {JSX.Element} The rendered WelcomePage component.
 */
function WelcomePage(): JSX.Element {
    return (
        <>
            {/* Set the page title for SEO and browser display */}
            <Head title="هلا" />

            {/* Render the welcome logo */}
            <WelcomeLogo />

            {/* Main heading */}
            <h4>
                محفظتنا
            </h4>

            {/* Description with emphasized text */}
            <p className='text-muted'>
                تتبع المصاريف <span className='text-foreground'>المشتركة</span> بين الأصدقاء والعائلة
            </p>

            {/* Hero image for visual appeal */}
            <img src='/images/hero.svg' alt='محفظتنا' className='-mt-10 -mb-6' loading='lazy' />

            {/* Button linking to the email entry page */}
            <Button asChild size={'wide'}>
                <Link href={route('welcome.enterEmail')}>
                    ابدأ الآن
                    {/* Icon for additional visual indication */}
                    <Icon icon='line-md:log-in' className='size-4' />
                </Link>
            </Button>

            {/* Disclaimer regarding terms of service and privacy policy */}
            <small className='px-8 text-center text-muted'>
                بالضغط على الزر أعلاه، أنت توافق على <span className='text-foreground'>شروط الاستخدام</span> و<span className='text-foreground'>سياسة الخصوصية</span>
            </small>
        </>
    );
}

WelcomePage.layout = (page: JSX.Element) => <WelcomeLayout>{page}</WelcomeLayout>;
export default WelcomePage;
