import { useState } from 'react';
// Local app-level styles are no longer needed; the modal imports its own CSS
import SegmentModal from './components/SegmentModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <div className="page">
        <button className="primary-button" onClick={() => setIsModalOpen(true)}>Save segment</button>
      </div>

      <SegmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
