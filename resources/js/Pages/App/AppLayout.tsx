import MainLayout from "../MainLayout";
import Navbar from "./Navbar";


export default function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <MainLayout>
            <div className="container mx-auto p-4 bg-background">
                {children}
            </div>
            <Navbar />
        </MainLayout>
    );
}
