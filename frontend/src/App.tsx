import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import Search from './pages/Search';

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/departures" element={<p>Departures</p>} />
          <Route path="/results" element={<p>Results</p>} />
          {/* <Route component={NotFound} /> */}
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
