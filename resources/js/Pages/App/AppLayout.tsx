import Navbar from "./Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <>
            <div className="container mx-auto p-4">
                {children}
            </div>
            <Navbar />
        </>
    );
}