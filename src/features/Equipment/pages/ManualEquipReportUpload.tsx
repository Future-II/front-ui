import React, { useState, useMemo } from 'react';
import { Upload, Plus, User } from 'lucide-react';

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface Resident {
  id: number;
  name: string;
  contributionRate: string;
}

interface ReportUser {
  id: number;
  username: string;
}

interface ReportData {
  reportTitle: string;
  purposeOfAssessment: string;
  valueHypothesis: string;
  reportType: string;
  evaluationDate: string;
  reportReleaseDate: string;
  specialAssumptions: string;
  finalOpinionOnValue: string;
  evaluationCurrency: string;
  assumptions: string;
}

const ReportsManagementSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [reportData, setReportData] = useState<ReportData>({
    reportTitle: '',
    purposeOfAssessment: 'to set',
    valueHypothesis: 'to set',
    reportType: 'detailed',
    evaluationDate: '',
    reportReleaseDate: '',
    specialAssumptions: '',
    finalOpinionOnValue: '',
    evaluationCurrency: 'Saudi riyal',
    assumptions: ''
  });

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: '', phone: '', email: '' }
  ]);

  const [residents, setResidents] = useState<Resident[]>([
    { id: 1, name: 'to set', contributionRate: '100%' }
  ]);

  const [otherUsersReport, setOtherUsersReport] = useState(false);
  const [reportUsers, setReportUsers] = useState<ReportUser[]>([
    { id: 1, username: '' }
  ]);
  const [uploadedFile, setUploadedFile] = useState('');
  const [uploadedPDF, setUploadedPDF] = useState('');
  const [reportCondition, setReportCondition] = useState('new');

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!reportData.reportTitle.trim()) {
      newErrors.reportTitle = 'Report title is required';
    }
    if (!reportData.evaluationDate) {
      newErrors.evaluationDate = 'Evaluation date is required';
    }
    if (!reportData.reportReleaseDate) {
      newErrors.reportReleaseDate = 'Report release date is required';
    }
    if (!reportData.finalOpinionOnValue.trim()) {
      newErrors.finalOpinionOnValue = 'Final Opinion on Value is required';
    }

    clients.forEach((client) => {
      if (!client.name.trim()) {
        newErrors[`client_${client.id}_name`] = 'Customer name is required';
      }
      if (!client.phone.trim()) {
        newErrors[`client_${client.id}_phone`] = 'Phone number is required';
      }
      if (!client.email.trim()) {
        newErrors[`client_${client.id}_email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(client.email)) {
        newErrors[`client_${client.id}_email`] = 'Email is not valid';
      }
    });

    if (otherUsersReport) {
      reportUsers.forEach((user) => {
        if (!user.username.trim()) {
          newErrors[`user_${user.id}_username`] = 'Report username is required';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addClient = () => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    setClients([...clients, { id: newId, name: '', phone: '', email: '' }]);
  };

  const deleteClient = (id: number) => {
    if (clients.length > 1) {
      setClients(clients.filter(c => c.id !== id));
      const newErrors = { ...errors };
      delete newErrors[`client_${id}_name`];
      delete newErrors[`client_${id}_phone`];
      delete newErrors[`client_${id}_email`];
      setErrors(newErrors);
    }
  };

  const addResident = () => {
    const newId = residents.length > 0 ? Math.max(...residents.map(r => r.id)) + 1 : 1;
    setResidents([...residents, { id: newId, name: 'to set', contributionRate: '100%' }]);
  };

  const deleteResident = (id: number) => {
    if (residents.length > 1) {
      setResidents(residents.filter(r => r.id !== id));
    }
  };

  const addUser = () => {
    const newId = reportUsers.length > 0 ? Math.max(...reportUsers.map(u => u.id)) + 1 : 1;
    setReportUsers([...reportUsers, { id: newId, username: '' }]);
  };

  const deleteUser = (id: number) => {
    if (reportUsers.length > 1) {
      setReportUsers(reportUsers.filter(u => u.id !== id));
      const newErrors = { ...errors };
      delete newErrors[`user_${id}_username`];
      setErrors(newErrors);
    }
  };

  const updateClient = (id: number, field: keyof Client, value: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    const errorKey = `client_${id}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const updateResident = (id: number, field: keyof Resident, value: string) => {
    setResidents(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const updateUser = (id: number, field: keyof ReportUser, value: string) => {
    setReportUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
    const errorKey = `user_${id}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const updateReportData = (field: keyof ReportData, value: string) => {
    setReportData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSaveAndContinue = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedPDF(file.name);
    }
  };

  const triggerPDFUpload = () => {
    const input = document.getElementById('pdfFileInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const triggerExcelUpload = () => {
    const input = document.getElementById('excelFileInput') as HTMLInputElement;
    if (input) {
      input.click();
    }
  };

  const StepIndicator = useMemo(() => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          1
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 1 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Report data</div>
        </div>
        
        <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          2
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 2 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Upload Excel report</div>
        </div>
        
        <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
          3
        </div>
        <div className="text-sm text-center">
          <div className={currentStep >= 3 ? 'text-blue-500 font-medium' : 'text-gray-500'}>Report sending result</div>
        </div>
      </div>
    </div>
  ), [currentStep]);

  const renderStep1 = useMemo(() => (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">New report</h2>
      
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Report information</h3>
        
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reportTitle ? 'border-red-500' : 'border-gray-300'}`}
              value={reportData.reportTitle}
              onChange={(e) => updateReportData('reportTitle', e.target.value)}
            />
            {errors.reportTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.reportTitle}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of assessment<span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reportData.purposeOfAssessment}
              onChange={(e) => updateReportData('purposeOfAssessment', e.target.value)}
            >
              <option>to set</option>
              <option>to se2</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value hypothesis<span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reportData.valueHypothesis}
              onChange={(e) => updateReportData('valueHypothesis', e.target.value)}
            >
              <option>to set</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-6">
            {[
              { value: 'detailed', label: 'Detailed report' },
              { value: 'summary', label: 'Report Summary' },
              { value: 'reviewNew', label: 'Review with new value' },
              { value: 'reviewWithout', label: 'Review without new value' }
            ].map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input 
                    type="radio" 
                    name="reportType" 
                    value={option.value}
                    checked={reportData.reportType === option.value} 
                    onChange={(e) => updateReportData('reportType', e.target.value)} 
                    className="sr-only" 
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${reportData.reportType === option.value ? 'border-green-500' : 'border-gray-300'} mr-2`}>
                    {reportData.reportType === option.value && (
                      <div className="w-2 h-2 bg-green-500 rounded-full m-0.5"></div>
                    )}
                  </div>
                </div>
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.evaluationDate ? 'border-red-500' : 'border-gray-300'}`}
              value={reportData.evaluationDate}
              onChange={(e) => updateReportData('evaluationDate', e.target.value)}
            />
            {errors.evaluationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.evaluationDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report release date<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.reportReleaseDate ? 'border-red-500' : 'border-gray-300'}`}
              value={reportData.reportReleaseDate}
              onChange={(e) => updateReportData('reportReleaseDate', e.target.value)}
            />
            {errors.reportReleaseDate && (
              <p className="text-red-500 text-sm mt-1">{errors.reportReleaseDate}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assumptions
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              value={reportData.assumptions}
              onChange={(e) => updateReportData('assumptions', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special assumptions
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={1}
              value={reportData.specialAssumptions}
              onChange={(e) => updateReportData('specialAssumptions', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Opinion on Value<span className="text-red-500">*</span>
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.finalOpinionOnValue ? 'border-red-500' : 'border-gray-300'}`}
              rows={1}
              value={reportData.finalOpinionOnValue}
              onChange={(e) => updateReportData('finalOpinionOnValue', e.target.value)}
            />
            {errors.finalOpinionOnValue && (
              <p className="text-red-500 text-sm mt-1">{errors.finalOpinionOnValue}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluation currency<span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reportData.evaluationCurrency}
              onChange={(e) => updateReportData('evaluationCurrency', e.target.value)}
            >
              <option>Saudi riyal</option>
            </select>
          </div>
        </div>

        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          onClick={triggerPDFUpload}
        >
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-4">Drag or drop a PDF file to upload.</p>
          <button 
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              triggerPDFUpload();
            }}
          >
            Select PDF File
          </button>
          {uploadedPDF && (
            <p className="text-green-600 text-sm mt-2">PDF selected: {uploadedPDF}</p>
          )}
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            id="pdfFileInput"
            onChange={handlePDFUpload}
          />
        </div>
      </div>

      {/* Customer Data Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Customer data</h3>
        
        {clients.map((client) => (
          <div key={client.id} className="grid grid-cols-4 gap-6 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${client.id}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                value={client.name}
                onChange={(e) => updateClient(client.id, 'name', e.target.value)}
              />
              {errors[`client_${client.id}_name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${client.id}_name`]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${client.id}_phone`] ? 'border-red-500' : 'border-gray-300'}`}
                value={client.phone}
                onChange={(e) => updateClient(client.id, 'phone', e.target.value)}
              />
              {errors[`client_${client.id}_phone`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${client.id}_phone`]}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`client_${client.id}_email`] ? 'border-red-500' : 'border-gray-300'}`}
                value={client.email}
                onChange={(e) => updateClient(client.id, 'email', e.target.value)}
              />
              {errors[`client_${client.id}_email`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`client_${client.id}_email`]}</p>
              )}
            </div>
            
            <div>
              <button 
                type="button"
                onClick={() => deleteClient(client.id)}
                disabled={clients.length === 1}
                className={`px-4 py-3 rounded-lg border ${
                  clients.length === 1 
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'border-red-500 text-red-500 hover:bg-red-50'
                }`}
              >
                Delete a client
              </button>
            </div>
          </div>
        ))}
        
        <div className="mb-6">
          <button 
            type="button"
            onClick={addClient}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Add a client
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input 
            type="checkbox" 
            id="otherUsersReport"
            checked={otherUsersReport}
            onChange={(e) => setOtherUsersReport(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label htmlFor="otherUsersReport" className="text-sm text-gray-700">Other users report</label>
        </div>

        {otherUsersReport && (
          <div className="mt-4">
            <h4 className="text-md font-medium text-blue-600 mb-4">Other users of the report</h4>
            {reportUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-2 gap-6 mb-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${user.id}_username`] ? 'border-red-500' : 'border-gray-300'}`}
                    value={user.username}
                    onChange={(e) => updateUser(user.id, 'username', e.target.value)}
                  />
                  {errors[`user_${user.id}_username`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`user_${user.id}_username`]}</p>
                  )}
                </div>
                <div>
                  <button 
                    type="button"
                    onClick={() => deleteUser(user.id)}
                    disabled={reportUsers.length === 1}
                    className={`px-4 py-3 rounded-lg border ${
                      reportUsers.length === 1 
                        ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                        : 'border-red-500 text-red-500 hover:bg-red-50'
                    }`}
                  >
                    Delete user
                  </button>
                </div>
              </div>
            ))}
            <button 
              type="button"
              onClick={addUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add a user
            </button>
          </div>
        )}
      </div>

      {/* Resident Data Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Resident data</h3>
        
        {residents.map((resident) => (
          <div key={resident.id} className="grid grid-cols-3 gap-6 mb-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resident Name <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={resident.name}
                onChange={(e) => updateResident(resident.id, 'name', e.target.value)}
              >
                <option>to set</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contribution rate<span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={resident.contributionRate}
                onChange={(e) => updateResident(resident.id, 'contributionRate', e.target.value)}
              >
                <option>100%</option>
                <option>75%</option>
                <option>50%</option>
                <option>25%</option>
              </select>
            </div>
            
            <div>
              <button 
                type="button"
                onClick={() => deleteResident(resident.id)}
                disabled={residents.length === 1}
                className={`px-4 py-3 rounded-lg border ${
                  residents.length === 1 
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                    : 'border-red-500 text-red-500 hover:bg-red-50'
                }`}
              >
                delete
              </button>
            </div>
          </div>
        ))}
        
        <div>
          <button 
            type="button"
            onClick={addResident}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add a resident
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          type="button"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
        >
          حفظ واعادة
        </button>
        <button 
          type="button"
          onClick={handleSaveAndContinue}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save and continue
        </button>
      </div>
    </div>
  ), [reportData, clients, residents, reportUsers, otherUsersReport, errors, uploadedPDF]);

  const renderStep2 = useMemo(() => (
    <div className="max-w-4xl mx-auto p-6">
      <div 
        className="bg-white rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={triggerExcelUpload}
      >
        <Upload className="mx-auto mb-6 text-gray-400" size={80} />
        <h3 className="text-xl font-semibold mb-2">Drag or click to upload an Excel file.</h3>
        <p className="text-gray-600 mb-6">The file must be in XLSX or XLS format.</p>
        
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            triggerExcelUpload();
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg mb-4"
        >
          Select Excel file
        </button>
        
        <input 
          type="file" 
          accept=".xlsx,.xls" 
          onChange={handleFileUpload} 
          className="hidden" 
          id="excelFileInput"
        />
        
        {uploadedFile && (
          <p className="text-green-600 text-sm">File selected: {uploadedFile}</p>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <button 
          type="button"
          onClick={() => setCurrentStep(1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg"
        >
          Back
        </button>
        <button 
          type="button"
          onClick={() => setCurrentStep(3)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  ), [uploadedFile]);

  const renderStep3 = useMemo(() => (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Report sending result</h2>
      <p className="text-gray-600 mb-6">Summary of the submitted report:</p>
      
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div className="font-semibold">Report number</div>
          <div className="font-semibold">Report title</div>
          <div className="font-semibold">Evaluation date</div>
          <div className="font-semibold">the condition</div>
          <div className="font-semibold">procedures</div>
          <div></div>
        </div>
        
        <div className="grid grid-cols-6 gap-4 items-center">
          <div>---</div>
          <div>{reportData.reportTitle || '---'}</div>
          <div>{reportData.evaluationDate || '---'}</div>
          <div className="relative">
            <select 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={reportCondition}
              onChange={(e) => setReportCondition(e.target.value)}
            >
              <option value="new">new</option>
              <option value="partially">Partially complete</option>
              <option value="complete">complete</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              send
            </button>
            <button 
              type="button"
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
            >
              amendment
            </button>
            <button 
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              rebroadcast
            </button>
          </div>
          <div></div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button 
          type="button"
          onClick={() => {
            setCurrentStep(1);
            setReportData({
              reportTitle: '',
              purposeOfAssessment: 'to set',
              valueHypothesis: 'to set',
              reportType: 'detailed',
              evaluationDate: '',
              reportReleaseDate: '',
              specialAssumptions: '',
              finalOpinionOnValue: '',
              evaluationCurrency: 'Saudi riyal',
              assumptions: ''
            });
            setClients([{ id: 1, name: '', phone: '', email: '' }]);
            setResidents([{ id: 1, name: 'to set', contributionRate: '100%' }]);
            setReportUsers([{ id: 1, username: '' }]);
            setOtherUsersReport(false);
            setUploadedFile('');
            setUploadedPDF('');
            setErrors({});
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Upload a new report
        </button>
      </div>
    </div>
  ), [reportData.reportTitle, reportData.evaluationDate, reportCondition]);

  const Header = useMemo(() => (
    <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-blue-600">Reports Management System</h1>
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="text-gray-600">AR</button>
        <button type="button" className="bg-blue-500 text-white px-2 py-1 rounded text-sm">EN</button>
        <div className="flex items-center gap-2">
          <User size={20} className="text-gray-600" />
          <span className="text-sm text-gray-600">Reports Company</span>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {Header}
      
      <div className="p-6">
        {StepIndicator}
        
        {currentStep === 1 && renderStep1}
        {currentStep === 2 && renderStep2}
        {currentStep === 3 && renderStep3}
      </div>
    </div>
  );
};

export default ReportsManagementSystem;