import ListNavComponent from "./_components/nav.component";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" flex flex-col">
      <header className="p-2 flex justify-between items-center">
        <ListNavComponent />
      </header>
      <main className="flex-1 p-2">{children}</main>
    </div>
  );
}
