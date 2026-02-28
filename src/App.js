import React, { useState, useEffects } from 'react';
import { Plus, Minus, X, AlertCircle } from 'lucide-react';

const App = () => {
  const [departments, setDepartments] = useState([]);
  const [currentDept, setCurrentDept] = useState(null);
  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [zoom, setZoom] = useState(1);
  
  // Modal States
  const [modalType, setModalType] = useState(null); // 'frustration' or 'metric'
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [tempItems, setTempItems] = useState([]);
  const [newItemInput, setNewItemInput] = useState("");
  const [error, setError] = useState("");

  // Logic to add a department
  const addDept = () => {
    const name = prompt("Department Name:");
    if (name) setDepartments([...departments, { id: Date.now(), name }]);
  };

  // Logic to create a map
  const createMap = () => {
    if (!currentDept) return alert("Select a department first");
    const title = prompt("Process Map Name:");
    const newMap = {
      id: Date.now(),
      deptId: currentDept.id,
      title,
      steps: [
        { 
          id: 'm1', 
          text: 'Initial Major Step', 
          subSteps: [{ id: 's1', text: 'Sub Step 1', frustrations: [], metrics: [] }] 
        }
      ]
    };
    setMaps([...maps, newMap]);
    setActiveMap(newMap);
  };

  // Handle Modal Actions
  const openModal = (type) => {
    setModalType(type);
    setSelectedMajor("");
    setSelectedSub("");
    setTempItems([]);
  };

  const handleSubClickAttempt = () => {
    if (!selectedMajor) setError("You must first select a major process step");
  };

  const addItem = () => {
    if (!newItemInput.trim()) return;
    if (tempItems.includes(newItemInput)) return alert("Duplicate entry!");
    setTempItems([...tempItems, newItemInput]);
    setNewItemInput("");
  };

  const saveToMap = () => {
    const updatedSteps = activeMap.steps.map(m => {
      if (m.id === selectedMajor) {
        return {
          ...m,
          subSteps: m.subSteps.map(s => {
            if (s.id === selectedSub) {
              const field = modalType === 'frustration' ? 'frustrations' : 'metrics';
              return { ...s, [field]: [...s[field], ...tempItems] };
            }
            return s;
          })
        };
      }
      return m;
    });
    setActiveMap({ ...activeMap, steps: updatedSteps });
    setModalType(null);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Global Header */}
        <header className="bg-[#094780] h-16 flex items-center justify-between px-8 shadow-lg z-50">
          <div className="flex items-center gap-3">
            {/* Simple Icon placeholder */}
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">
              Process Mapping Tool
            </h1>
          </div>  
  
  {/* Sidebar */}
      <div className="w-64 bg-slate-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">OpsMapper Pro</h2>
        <button onClick={addDept} className="w-full bg-blue-600 p-2 rounded mb-4">+ Add Dept</button>
        <div className="space-y-2">
          {departments.map(d => (
            <div key={d.id} onClick={() => setCurrentDept(d)} className={`p-2 cursor-pointer rounded ${currentDept?.id === d.id ? 'bg-blue-500' : 'hover:bg-slate-700'}`}>
              {d.name}
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
  <div className="flex items-center gap-4">
    <button 
      onClick={() => alert("Account settings coming soon!")}
      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md border border-white/30 transition-colors text-sm font-medium"
    >
      Account
    </button>
  </div>
</header>

        {activeMap && (
          <div className="p-4 border-b flex gap-4 bg-white">
            <button onClick={() => openModal('frustration')} className="bg-red-500 text-white px-4 py-1 rounded text-sm">Assign Frustration</button>
            <button onClick={() => openModal('metric')} className="bg-blue-500 text-white px-4 py-1 rounded text-sm">Assign Metric</button>
          </div>
        )}

        {/* Canvas */}
<div className="flex-1 overflow-auto p-12 bg-slate-200 shadow-inner">
  <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.2s' }} className="flex flex-col gap-12">
    {activeMap?.steps.map((major) => (
      <div key={major.id} className="flex items-start">
        
        {/* Major Flow Step (The Main Sticky Note) */}
        <div className="relative group">
          <div className="w-52 h-52 bg-yellow-300 shadow-xl border-t-4 border-yellow-400 p-6 flex items-center justify-center text-center transform hover:-rotate-1 transition-transform cursor-grab active:cursor-grabbing">
            <span className="font-bold text-slate-800 text-lg leading-tight uppercase tracking-wide">
              {major.text}
            </span>
            {/* Thumbtack effect */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full opacity-50"></div>
          </div>
          
          {/* Connector Line to Sub-flows */}
          <div className="absolute top-1/2 -right-8 w-8 h-1 bg-slate-400"></div>
        </div>

        {/* Sub Flow Container */}
        <div className="ml-8 flex flex-wrap gap-6 pt-4">
          {major.subSteps.map((sub, idx) => (
            <div 
              key={sub.id} 
              className={`relative w-44 h-44 bg-yellow-50 shadow-lg p-4 flex items-center justify-center text-center border-b-2 border-yellow-200 
                ${idx % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform`}
            >
              <p className="text-sm font-medium text-slate-700 leading-snug">
                {sub.text}
              </p>

              {/* Status Dots (Frustrations & Metrics) */}
              <div className="absolute -top-3 -right-3 flex flex-col gap-2">
                {sub.frustrations.length > 0 && (
                  <button 
                    onClick={() => alert(`Frustrations: \n• ${sub.frustrations.join('\n• ')}`)}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform border-2 border-white group"
                  >
                    {sub.frustrations.length}
                    <span className="hidden group-hover:block absolute right-10 bg-black text-white px-2 py-1 rounded">Frustrations</span>
                  </button>
                )}
                {sub.metrics.length > 0 && (
                  <button 
                    onClick={() => alert(`Metrics: \n• ${sub.metrics.join('\n• ')}`)}
                    className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform border-2 border-white group"
                  >
                    {sub.metrics.length}
                    <span className="hidden group-hover:block absolute right-10 bg-black text-white px-2 py-1 rounded">Metrics</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[500px]">
            <h2 className="text-xl font-bold mb-4 capitalize">Assign {modalType}</h2>
            
            <label className="block text-sm font-medium mb-1">Major Step</label>
            <select 
              className="w-full border p-2 mb-4" 
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
            >
              <option value="">Select Major Step</option>
              {activeMap.steps.map(s => <option key={s.id} value={s.id}>{s.text}</option>)}
            </select>

            <label className="block text-sm font-medium mb-1">Sub Step</label>
            <div onClick={handleSubClickAttempt}>
              <select 
                disabled={!selectedMajor}
                className="w-full border p-2 mb-4 disabled:bg-gray-100"
                value={selectedSub}
                onChange={(e) => setSelectedSub(e.target.value)}
              >
                <option value="">Select Sub Step</option>
                {activeMap.steps.find(s => s.id === selectedMajor)?.subSteps.map(ss => (
                  <option key={ss.id} value={ss.id}>{ss.text}</option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4">
              <input 
                className="border p-2 w-full mb-2" 
                placeholder={`Add new ${modalType}...`}
                value={newItemInput}
                onChange={(e) => setNewItemInput(e.target.value)}
              />
              <button onClick={addItem} className="bg-slate-800 text-white px-4 py-2 rounded w-full">Submit</button>
            </div>

            <div className="mt-4 max-h-32 overflow-auto">
              <p className="text-xs font-bold text-gray-500 uppercase">Current List:</p>
              {tempItems.map((item, idx) => (
                <div key={idx} className="text-sm p-1 border-b">{item}</div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setModalType(null)} className="px-4 py-2 border rounded">Close</button>
              <button onClick={saveToMap} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")}><X size={18}/></button>
        </div>
      )}
    </div>
  );
};

export default App;


