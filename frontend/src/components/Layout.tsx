const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <header className="mb-6 p-6">Header</header>
      <main className="mx-auto w-full max-w-screen-sm">{children}</main>
    </>
  );
};

export default Layout;
