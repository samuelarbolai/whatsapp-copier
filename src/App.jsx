import React, { useState } from 'react';
import { Copy, Check, Upload, X, Settings } from 'lucide-react';

const formatCompanyName = (company) => {
  if (!company || company === 'N/A') return company;
  return company.toLowerCase().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const defaultLeads = [
  { name: "Julio Alvaro", company: formatCompanyName("EQUIPOSDRMATE"), phone: "+573134085511" },
  { name: "Erik", company: formatCompanyName("Fintee"), phone: "4776469202" },
  { name: "Dirk", company: formatCompanyName("DATA BASTION"), phone: "+1 (713) 725-1998" },
  { name: "Jean", company: formatCompanyName("Simetrik"), phone: "3158237409" },
  { name: "Carlos", company: formatCompanyName("Voltac Systems"), phone: "3137297257" },
  { name: "Andrés", company: formatCompanyName("punto.com"), phone: "+573137767209" },
  { name: "Jorge", company: formatCompanyName("Sprots"), phone: "+56988278890" },
  { name: "Richard", company: formatCompanyName("Hoolox Enterprise"), phone: "+584244078528" },
  { name: "Luis", company: formatCompanyName("THEIA JOBS"), phone: "+1 7866460609" },
  { name: "Diana", company: formatCompanyName("DO-Innovation"), phone: "3155793973" },
  { name: "Camilo", company: formatCompanyName("Arbitr8"), phone: "+57 3107722253" },
  { name: "Carlos", company: formatCompanyName("Claramente"), phone: "+573173007728" },
  { name: "Isabella", company: formatCompanyName("Solo me interesa aprender"), phone: "3194444939" },
  { name: "Mariah", company: formatCompanyName("Innova Ulima"), phone: "+51939271493" },
  { name: "Yeison", company: formatCompanyName("EONS"), phone: "+573022440710" },
  { name: "Alex", company: formatCompanyName("Flatkit"), phone: "+573184025661" },
  { name: "Jairo", company: formatCompanyName("SACCU"), phone: "3107889550" },
  { name: "Jeronimo", company: formatCompanyName("Saccu"), phone: "+57167498546" },
  { name: "Juan Sebastián", company: "N/A", phone: "3143022851" },
  { name: "Sandy", company: formatCompanyName("MindTech solutions"), phone: "+51940242832" }
];

export default function WhatsAppMessageCopier() {
  const [leads, setLeads] = useState(defaultLeads);
  const [copied, setCopied] = useState({});
  const [uploadError, setUploadError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [teamMember, setTeamMember] = useState('Samuel');
  const [calendarLink, setCalendarLink] = useState('https://calendar.app.google/BSUcpKHnaUtU3csn7');
  const [teamPhone, setTeamPhone] = useState('+57 316 824 8411');

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV file is empty or invalid');
    
    const headers = lines[0].split(',').map(h => h.trim());
    const firstNameIndex = headers.findIndex(h => h.toLowerCase().includes('first name'));
    const companyIndex = headers.findIndex(h => h.toLowerCase().includes('company name'));
    const phoneIndex = headers.findIndex(h => h.toLowerCase().includes('whatsapp'));
    
    if (firstNameIndex === -1) throw new Error('Could not find "First Name" column');
    if (companyIndex === -1) throw new Error('Could not find "Company Name" column');
    if (phoneIndex === -1) throw new Error('Could not find "Whatsapp" column');
    
    const newLeads = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const name = values[firstNameIndex];
      const company = values[companyIndex];
      const phone = values[phoneIndex];
      
      if (name && name !== '') {
        newLeads.push({
          name: name,
          company: formatCompanyName(company) || 'N/A',
          phone: phone || 'N/A'
        });
      }
    }
    
    return newLeads;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadError('');
    
    try {
      const text = await file.text();
      const newLeads = parseCSV(text);
      
      if (newLeads.length === 0) {
        throw new Error('No valid leads found in CSV');
      }
      
      setLeads(newLeads);
      setCopied({});
      setUploadError('');
    } catch (error) {
      setUploadError(error.message);
      console.error('Error parsing CSV:', error);
    }
    
    event.target.value = '';
  };

  const resetToDefault = () => {
    setLeads(defaultLeads);
    setCopied({});
    setUploadError('');
  };

  const generateMessages = (name, company) => {
    const companyText = company === "N/A" ? "tu proyecto" : company;
    return [
      `Hola ${name}, cómo vas? hablás con Andrés. Felicitaciones por lo que estás haciendo con ${companyText}`,
      `Vi que te inscribiste a Fundraising School, quisiera que programaras una charla 1-1 con nuestro equipo de 30X para ver cómo te podemos ayudar a ti y a ${companyText}.`,
      `Avisáme si te interesa y agendá con ${teamMember} de mi team, sos uno de los que preseleccioné yo, entonces para guardar tu cupo rápido. Mira su calendar: 
${calendarLink}`,
      `Si no te cuadra la hora y querés reservar cupo, escribíle al ${teamPhone}`
    ];
  };

  const copyToClipboard = async (leadIndex, messageIndex, message) => {
    try {
      await navigator.clipboard.writeText(message);
      const key = `${leadIndex}_${messageIndex}`;
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleCheck = (index) => {
    setCopied(prev => ({ ...prev, [`checked_${index}`]: !prev[`checked_${index}`] }));
  };

  const completedCount = Object.keys(copied).filter(k => k.startsWith('checked_') && copied[k]).length;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">WhatsApp Message Copier</h1>
            <p className="text-gray-600">{leads.length} leads - 4 messages each</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                showSettings ? 'bg-orange-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium cursor-pointer transition-all">
              <Upload size={18} />
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {leads !== defaultLeads && (
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
              >
                <X size={18} />
                Reset
              </button>
            )}
          </div>
        </div>
        
        {showSettings && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Message Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Member Name
                </label>
                <input
                  type="text"
                  value={teamMember}
                  onChange={(e) => setTeamMember(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Samuel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar Link
                </label>
                <input
                  type="text"
                  value={calendarLink}
                  onChange={(e) => setCalendarLink(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://calendar.app.google/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Phone Number
                </label>
                <input
                  type="text"
                  value={teamPhone}
                  onChange={(e) => setTeamPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+57 316 824 8411"
                />
              </div>
            </div>
          </div>
        )}
        
        {uploadError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold">Error: {uploadError}</p>
            <p className="text-red-600 text-sm mt-1">Make sure your CSV has "First Name", "Company Name", and "Whatsapp" columns</p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-semibold">
            Progress: {completedCount} / {leads.length} leads completed
          </p>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / leads.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {leads.map((lead, leadIndex) => {
          const messages = generateMessages(lead.name, lead.company);
          const isChecked = copied[`checked_${leadIndex}`];

          return (
            <div 
              key={leadIndex} 
              className={`bg-white rounded-lg shadow-md p-5 transition-all ${
                isChecked ? 'opacity-50 border-2 border-green-300' : 'border-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isChecked || false}
                    onChange={() => toggleCheck(leadIndex)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {leadIndex + 1}. {lead.name}
                    </h3>
                    <p className="text-sm text-gray-500">{lead.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(leadIndex, 'phone', lead.phone)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                    copied[`${leadIndex}_phone`]
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {copied[`${leadIndex}_phone`] ? (
                    <>
                      <Check size={16} />
                      <span className="text-xs">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span className="text-xs">{lead.phone}</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="space-y-3">
                {messages.map((message, msgIndex) => {
                  const justCopied = copied[`${leadIndex}_${msgIndex}`];
                  return (
                    <div key={msgIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-500 mb-2">
                            Message {msgIndex + 1}/4
                          </p>
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {message}
                          </pre>
                        </div>
                        <button
                          onClick={() => copyToClipboard(leadIndex, msgIndex, message)}
                          className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                            justCopied 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {justCopied ? (
                            <>
                              <Check size={16} />
                              <span className="text-xs">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              <span className="text-xs">Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions:</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Click "Settings" to customize team member name, calendar link, and phone number</li>
          <li>Click "Upload CSV" to load new leads from a CSV file</li>
          <li>CSV must have columns: "First Name", "Company Name", and "Whatsapp"</li>
          <li>Click the phone number button to copy it, then paste in WhatsApp to start chat</li>
          <li>Copy and send each message separately in order (1/4, 2/4, 3/4, 4/4)</li>
          <li>Click "Copiar" on each message, paste in WhatsApp, send</li>
          <li>Check the box once all 4 messages are sent to that lead</li>
          <li>Click "Reset" to go back to the original 20 leads</li>
        </ul>
      </div>
    </div>
  );
}