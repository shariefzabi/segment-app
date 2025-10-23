import { useState } from 'react';
import './SegmentPage.css';
import SegmentModal from './SegmentModal';

function SegmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="page">
      <button className="primary-button" onClick={() => setIsModalOpen(true)}>Save segment</button>
      <SegmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default SegmentPage;


