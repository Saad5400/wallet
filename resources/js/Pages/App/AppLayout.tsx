import MainLayout from "../MainLayout";
import Navbar from "./Navbar";


export default function AppLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <MainLayout>
            <div className="container h-full p-4 pb-24 mx-auto overflow-y-auto bg-background no-scrollbar">
                {children}
            </div>
            <Navbar />
        </MainLayout>
    );
}
