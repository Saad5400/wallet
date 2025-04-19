import MainLayout from "../MainLayout";
import Navbar from "./Navbar";


export default function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <MainLayout>
            <div className="container h-full p-4 mx-auto mb-20 bg-background">
                {children}
            </div>
            <Navbar />
        </MainLayout>
    );
}
