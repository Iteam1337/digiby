import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <header className="flex w-full max-w-md flex-col items-center">
        Header
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<main>Content</main>} />
          {/* <Route component={NotFound} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
