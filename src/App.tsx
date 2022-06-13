import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Search from './pages/Search';

function App() {
  return (
    <div className="flex h-screen w-screen flex-col items-center m-10">
      <header className='mb-5'>
        Header
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Search/>} />
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
