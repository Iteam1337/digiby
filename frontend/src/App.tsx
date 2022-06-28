import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Layout from './components/Layout';
import Search from './pages/Search';
import Departures from './pages/Departures';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/departures" element={<Departures />} />
            <Route path="/results" element={<p>Results</p>} />
            {/* <Route component={NotFound} /> */}
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
