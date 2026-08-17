import Sidebar from '@/components/Sidebar';

export default function InternoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 ml-64">
                {children}
            </div>
        </div>
    );
}