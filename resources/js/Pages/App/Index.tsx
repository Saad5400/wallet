import AppLayout from "./AppLayout";

function Index() {
    return (
        <h1>App</h1>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
export default Index;
