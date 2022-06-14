const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <header className="mb-6 p-6">Header</header>
      <main className="w-100 mx-auto max-w-screen-lg">{children}</main>
    </>
  );
};

export default Layout;
