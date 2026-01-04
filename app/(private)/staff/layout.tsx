import ListNavComponent from "./_components/nav.component";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-2 flex justify-between items-center">
        {/* The Search component lives here in the layout */}
        <ListNavComponent />
      </header>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
