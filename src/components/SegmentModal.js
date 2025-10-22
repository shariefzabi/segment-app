import { useMemo, useState } from 'react';
import './SegmentModal.css';

const SCHEMA_OPTIONS = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Gender', value: 'gender' },
  { label: 'Age', value: 'age' },
  { label: 'Account Name', value: 'account_name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' }
];

export default function SegmentModal({ isOpen, onClose }) {
  const [segmentName, setSegmentName] = useState('');
  const [primarySelection, setPrimarySelection] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const unselectedOptions = useMemo(() => {
    return SCHEMA_OPTIONS.filter(o => !selectedSchemas.includes(o.value));
  }, [selectedSchemas]);

  function cleanupAndClose() {
    setSaveStatus('idle');
    setSaveMessage('');
    onClose();
  }

  function handleAddSchema() {
    if (!primarySelection) return;
    if (selectedSchemas.includes(primarySelection)) return;
    setSelectedSchemas(prev => [...prev, primarySelection]);
    setPrimarySelection('');
  }

  function handleChangeSchema(index, newValue) {
    setSelectedSchemas(prev => {
      const next = [...prev];
      if (next.includes(newValue) && next[index] !== newValue) {
        return prev;
      }
      next[index] = newValue;
      return next;
    });
  }

  function removeSchema(index) {
    setSelectedSchemas(prev => prev.filter((_, i) => i !== index));
  }

  function getLabelFor(value) {
    const found = SCHEMA_OPTIONS.find(o => o.value === value);
    return found ? found.label : value;
  }

  function getTraitType(value) {
    return value === 'account_name' ? 'group' : 'user';
  }

  async function handleSave() {
    const payload = {
      segment_name: segmentName.trim(),
      schema: selectedSchemas.map(v => ({ [v]: getLabelFor(v) }))
    };

    if (!payload.segment_name || payload.schema.length === 0) {
      setSaveStatus('error');
      setSaveMessage('Please enter a segment name and add at least one schema.');
      return;
    }

    try {
      setSaveStatus('saving');
      setSaveMessage('Saving...');

      // Use CRA dev proxy (configured in package.json) to avoid CORS in development
      const res = await fetch('/fbe4d0ba-5b71-4a9a-a53e-89df49c13b16', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      setSaveStatus('success');
      setSaveMessage('Segment saved successfully.');
      // console payload for visibility during development
      // eslint-disable-next-line no-console
      console.log('Saved payload:', payload);
    } catch (err) {
      setSaveStatus('error');
      setSaveMessage('Failed to save segment. Check console for details.');
      // eslint-disable-next-line no-console
      console.error('Save error', err);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
          <div className="modal-header teal">
          <div className="modal-header-left">
            <button className="icon-button back" aria-label="Back" onClick={cleanupAndClose}>‹</button>
            <div className="modal-title">Saving Segment</div>
          </div>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="segmentName" className="segment-name-label">Enter the name of the segment</label>
            <input
              id="segmentName"
              type="text"
              placeholder="Name of the segment"
              value={segmentName}
              onChange={e => setSegmentName(e.target.value)}
              className="segment-name-input"
            />
          </div>

          <div className="helper-text">
            To save your segment, you need to add the schemas to build the query
          </div>
          <div className="legend">
            <span className="dot user" /> <span className="legend-label">User Traits</span>
            <span className="dot group" /> <span className="legend-label">Group Traits</span>
          </div>

          <div className="blue-box">
            {selectedSchemas.length > 0 && (
              <div className="schema-list">
                {selectedSchemas.map((value, idx) => {
                  const available = SCHEMA_OPTIONS.filter(o => !selectedSchemas.includes(o.value) || o.value === value);
                  const trait = getTraitType(value);
                  return (
                    <div className="schema-row" key={`${value}-${idx}`}>
                      <span className={`dot ${trait}`} />
                      <select
                        value={value}
                        onChange={e => handleChangeSchema(idx, e.target.value)}
                      >
                        {available.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <button className="remove-btn" aria-label="Remove" onClick={() => removeSchema(idx)}>-</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="add-row">
            <div className="schema-add">
              <select
                id="addSchema"
                value={primarySelection}
                onChange={e => setPrimarySelection(e.target.value)}
              >
                <option value="" disabled>Select schema</option>
                {unselectedOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button
                className="link-button"
                onClick={handleAddSchema}
                disabled={!primarySelection}
              >
                + Add new schema
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">

          <button
            className="primary-button"
            onClick={handleSave}
            disabled={saveStatus === 'saving' || !segmentName.trim() || selectedSchemas.length === 0}
          >
            Save the segment
          </button>
          <button className="secondary-button" onClick={cleanupAndClose}>Cancel</button>
        </div>

        {saveStatus !== 'idle' && (
          <div className={`save-status ${saveStatus}`}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}


