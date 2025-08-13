import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { columns, reportData } from '../components/data';
import SelectStep from '../components/SelectStep';
import VerifyStep from '../components/VerifyStep';
import SendStep from '../components/SendStep';
import ResultStep from '../components/ResultStep';
import type { ProgressStage, WorkflowStep } from '../components/types';

const MekyasReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'automatic' | 'single' | 'manual'>('automatic');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [progressStage, setProgressStage] = useState<ProgressStage>('withdraw');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('select');
  const [processingResult, setProcessingResult] = useState<'success' | 'error' | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Record<number, boolean>>({});

  // selection helpers
  const handleRowSelect = (rowId: number) => {
    setSelectedRows((prev) => (prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]));
  };
  const handleSelectAll = () => {
    setSelectedRows((prev) => (prev.length === reportData.length ? [] : reportData.map((_, index) => index)));
  };

  // workflow actions
  const startProcess = () => {
    setCurrentStep('verify');
    const initial: Record<number, boolean> = {};
    selectedRows.forEach((rowIndex) => (initial[rowIndex] = true));
    setVerificationStatus(initial);
  };

  const startSendingProcess = () => {
    setCurrentStep('send');
    setIsProcessing(true);
    setProgressStage('withdraw');
    setProgressPercentage(0);

    // withdraw -> verify -> send (simulated)
    const withdraw = setInterval(() => {
      setProgressPercentage((p) => {
        if (p >= 100) {
          clearInterval(withdraw);
          setProgressStage('verify');
          setProgressPercentage(0);

          const verify = setInterval(() => {
            setProgressPercentage((p2) => {
              if (p2 >= 100) {
                clearInterval(verify);
                setProgressStage('send');
                setProgressPercentage(0);

                const send = setInterval(() => {
                  setProgressPercentage((p3) => {
                    if (p3 >= 100) {
                      clearInterval(send);
                      setIsProcessing(false);
                      setCurrentStep('result');
                      setProcessingResult(Math.random() > 0.2 ? 'success' : 'error');
                      return 100;
                    }
                    return p3 + 5;
                  });
                }, 200);
                return 100;
              }
              return p2 + 5;
            });
          }, 150);

          return 100;
        }
        return p + 2;
      });
    }, 100);
  };

  const cancelProcess = () => {
    setIsProcessing(false);
    setCurrentStep('select');
  };

  const resetWorkflow = () => {
    setCurrentStep('select');
    setSelectedRows([]);
    setProcessingResult(null);
    setProgressPercentage(0);
    setIsProcessing(false);
  };

  const toggleVerificationStatus = (rowIndex: number) => {
    setVerificationStatus((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }));
  };

  // tab renderer
  const renderActiveTabContent = () => {
    if (activeTab === 'automatic') {
      switch (currentStep) {
        case 'select':
          return (
            <SelectStep
              columns={columns}
              data={reportData}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
              onContinue={startProcess}
            />
          );
        case 'verify':
          return (
            <VerifyStep
              reportData={reportData}
              selectedRows={selectedRows}
              verificationStatus={verificationStatus}
              toggleVerificationStatus={toggleVerificationStatus}
              setCurrentStep={setCurrentStep}
              startSendingProcess={startSendingProcess}
            />
          );
        case 'send':
          return (
            <SendStep
              progressPercentage={progressPercentage}
              progressStage={progressStage}
              cancelProcess={cancelProcess}
            />
          );
        case 'result':
          return (
            <ResultStep
              processingResult={processingResult}
              selectedCount={selectedRows.length}
              resetWorkflow={resetWorkflow}
            />
          );
      }
    }

    if (activeTab === 'single') {
      return (
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">سحب تقرير واحد</h3>
            <p className="text-gray-600 mb-4">ابحث عن تقرير محدد وقم بسحبه وإرساله إلى نظام الهيئة</p>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ادخل رقم التقرير أو اسمه..."
                  className="w-full pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              بحث
            </button>
          </div>
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>قم بالبحث عن تقرير للبدء</p>
          </div>
        </div>
      );
    }

    // manual
    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">سحب تقرير يدوي</h3>
          <p className="text-gray-600 mb-4">قم برفع ملفات التقرير من جهازك لإرسالها إلى نظام الهيئة</p>
          <div className="space-y-4">
            <UploadBlock label="اسحب ملف Excel أو انقر للتحميل" accept=".xlsx,.xls" inputId="excel-upload" />
            <UploadBlock label="اسحب ملفات PDF المرتبطة أو انقر للتحميل" accept=".pdf" inputId="pdf-upload" multiple />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled>
            بدء عملية السحب والإرسال
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">تقارير المعدات</h1>
        <p className="text-gray-600">إدارة سحب وإرسال تقارير نظام المعدات</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <TabButton active={activeTab === 'automatic'} onClick={() => { setActiveTab('automatic'); if (currentStep !== 'select') resetWorkflow(); }}>
              سحب التقارير التلقائي
            </TabButton>
            <TabButton active={activeTab === 'single'} onClick={() => { setActiveTab('single'); resetWorkflow(); }}>
              سحب تقرير واحد
            </TabButton>
            <TabButton active={activeTab === 'manual'} onClick={() => { setActiveTab('manual'); resetWorkflow(); }}>
              سحب تقرير يدوي
            </TabButton>
          </nav>
        </div>
        <div className="p-6">{renderActiveTabContent()}</div>
      </div>
    </div>
  );
};

const UploadBlock: React.FC<{ label: string; accept: string; inputId: string; multiple?: boolean }> = ({
  label, accept, inputId, multiple
}) => (
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
    <p className="text-gray-600 mb-2">{label}</p>
    <p className="text-gray-500 text-sm">يمكنك تحميل عدة ملفات</p>
    <input type="file" className="hidden" accept={accept} multiple={multiple} id={inputId} />
    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      onClick={() => document.getElementById(inputId)?.click()}>
      اختيار ملف
    </button>
  </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
      active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default MekyasReports;
