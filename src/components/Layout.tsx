const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <header className="mb-6 p-6">Header</header>
      <main className="mx-auto w-full max-w-screen-lg">{children}</main>
    </>
  );
};

export default Layout;
