import MainLayout from "../MainLayout";
import Navbar from "./Navbar";


export default function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <MainLayout>
            <div className="container mx-auto p-4">
                {children}
            </div>
            <Navbar />
        </MainLayout>
    );
}
