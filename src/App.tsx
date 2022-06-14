import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <header className="flex w-full max-w-md flex-col items-center">
        Header
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<p>Search</p>} />
            <Route path="/departures" element={<p>Departures</p>} />
            <Route path="/results" element={<p>Results</p>} />
            {/* <Route component={NotFound} /> */}
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
