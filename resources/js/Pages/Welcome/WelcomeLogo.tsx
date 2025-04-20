import { cn } from "@/lib/utils";

/**
 * WelcomeLogo Component
 *
 * This component renders a logo image with default styling that can be customized via props.
 * It uses the `cn` utility function to combine default and provided CSS class names.
 *
 * @param {React.ComponentProps<'img'>} props - The props for the image element.
 * @param {string} props.className - Additional class names to apply to the image.
 * @param {React.CSSProperties} props.style - Inline styles to apply to the image.
 * @returns {JSX.Element} The rendered image element.
 */
export default function WelcomeLogo({
    className,
    style,
    ...props
}: React.ComponentProps<'img'>) {
    return (
        <img
            // The source of the logo image.
            src='/favicon.webp'
            // Combine the default classes with any additional classes provided.
            className={cn('rounded-4xl size-32', className)}
            style={{ ...style }}
            // Spread any additional props to the underlying img element.
            {...props}
        />
    );
}
