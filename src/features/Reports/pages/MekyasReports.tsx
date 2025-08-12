import React, { useState } from 'react';
import { FileText, Upload, Check, AlertTriangle, Search, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../shared/components/Common/Table';
import ProgressBar from '../../../shared/components/Common/ProgressBar';
// Define workflow steps
type WorkflowStep = 'select' | 'verify' | 'send' | 'result';
const MekyasReports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'automatic' | 'single' | 'manual'>('automatic');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [progressStage, setProgressStage] = useState<'withdraw' | 'verify' | 'send'>('withdraw');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('select');
  const [processingResult, setProcessingResult] = useState<'success' | 'error' | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<Record<string, boolean>>({});
  // Sample data for the table - similar to the screenshot
  const reportData = [{
    id: 1,
    reportName: 'بيانات معدات الرياض',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '1.6 MB',
    date: '15/05/2023',
    status: 'مكتمل',
    equipmentType: 'شاحنة نقالة',
    location: 'الرياض',
    referenceNo: '20230419-1',
    quantity: '1'
  }, {
    id: 2,
    reportName: 'قائمة معدات الرياض',
    reportType: 'PDF',
    source: 'نظام المعدات',
    size: '0.9 MB',
    date: '12/05/2023',
    status: 'مكتمل',
    equipmentType: 'آلية متحركة',
    location: 'الرياض',
    referenceNo: '20230429-1',
    quantity: '1'
  }, {
    id: 3,
    reportName: 'تقرير معدات جدة',
    type: 'CSV',
    source: 'نظام المعدات',
    size: '0.7 MB',
    date: '10/05/2023',
    status: 'مكتمل',
    equipmentType: 'حفارة',
    location: 'جدة',
    referenceNo: '20230413-1',
    quantity: '1'
  }, {
    id: 4,
    reportName: 'بيانات معدات لوجي',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '1.2 MB',
    date: '08/05/2023',
    status: 'مكتمل',
    equipmentType: 'شاحنة نقالة',
    location: 'لوجي',
    referenceNo: '20230517-1',
    quantity: '1'
  }, {
    id: 5,
    reportName: 'تقرير معدات الدمام',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '0.8 MB',
    date: '05/05/2023',
    status: 'مكتمل',
    equipmentType: 'آلية متحركة',
    location: 'الدمام',
    referenceNo: '20230428-1',
    quantity: '1'
  }, {
    id: 6,
    reportName: 'تقرير معدات الدمام',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '0.8 MB',
    date: '01/05/2023',
    status: 'مكتمل',
    equipmentType: 'آلية متحركة',
    location: 'الدمام',
    referenceNo: '20230428-1',
    quantity: '1'
  }, {
    id: 7,
    reportName: 'بيانات معدات الرياض',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '6.3 MB',
    date: '28/04/2023',
    status: 'مكتمل',
    equipmentType: 'شاحنة نقالة',
    location: 'الرياض',
    referenceNo: '20230418-1',
    quantity: '1'
  }, {
    id: 8,
    reportName: 'بيانات معدات الرياض',
    reportType: 'XLSX',
    source: 'نظام المعدات',
    size: '5.2 MB',
    date: '25/04/2023',
    status: 'مكتمل',
    equipmentType: 'شاحنة نقالة',
    location: 'الرياض',
    referenceNo: '20230415-1',
    quantity: '1'
  }];
  const columns = [{
    header: '#',
    accessor: 'id'
  }, {
    header: 'المعرف',
    accessor: 'id'
  }, {
    header: 'اسم المستخدم',
    accessor: 'reportName'
  }, {
    header: 'المصدر',
    accessor: 'source'
  }, {
    header: 'نوع المعدة',
    accessor: 'equipmentType'
  }, {
    header: 'الموقع',
    accessor: 'location'
  }, {
    header: 'المرجع',
    accessor: 'referenceNo'
  }, {
    header: 'الكمية',
    accessor: 'quantity'
  }, {
    header: 'الحالة',
    accessor: 'status',
    render: (value: string) => {
      if (value === 'مكتمل') {
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center w-fit">
              <Check className="h-3 w-3 mr-1" />
              {value}
            </span>;
      }
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center w-fit">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {value}
          </span>;
    }
  }];
  const handleRowSelect = (rowId: number) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter(id => id !== rowId));
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };
  const handleSelectAll = () => {
    if (selectedRows.length === reportData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(reportData.map((_, index) => index));
    }
  };
  const startProcess = () => {
    setCurrentStep('verify');
    // Initialize verification status for all selected reports
    const initialStatus: Record<string, boolean> = {};
    selectedRows.forEach(rowId => {
      initialStatus[rowId] = true;
    });
    setVerificationStatus(initialStatus);
  };
  const startSendingProcess = () => {
    setCurrentStep('send');
    setIsProcessing(true);
    setProgressStage('withdraw');
    setProgressPercentage(0);
    // Simulate the process
    const withdrawInterval = setInterval(() => {
      setProgressPercentage(prev => {
        if (prev >= 100) {
          clearInterval(withdrawInterval);
          setProgressStage('verify');
          setProgressPercentage(0);
          // Start verification process
          const verifyInterval = setInterval(() => {
            setProgressPercentage(prev => {
              if (prev >= 100) {
                clearInterval(verifyInterval);
                setProgressStage('send');
                setProgressPercentage(0);
                // Start sending process
                const sendInterval = setInterval(() => {
                  setProgressPercentage(prev => {
                    if (prev >= 100) {
                      clearInterval(sendInterval);
                      setIsProcessing(false);
                      setCurrentStep('result');
                      // Simulate success with 80% probability
                      setProcessingResult(Math.random() > 0.2 ? 'success' : 'error');
                      return 100;
                    }
                    return prev + 5;
                  });
                }, 200);
                return 100;
              }
              return prev + 5;
            });
          }, 150);
          return 100;
        }
        return prev + 2;
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
  const toggleVerificationStatus = (rowId: number) => {
    setVerificationStatus({
      ...verificationStatus,
      [rowId]: !verificationStatus[rowId]
    });
  };
  const filteredData = reportData.filter(report => (report.reportName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (report.source?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || (report.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()));
  const renderSelectStep = () => {
    return <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            سحب التقارير التلقائي
          </h3>
          <p className="text-gray-600 mb-4">
            اختر التقارير التي ترغب في سحبها وإرسالها تلقائياً إلى نظام الهيئة
          </p>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="البحث في التقارير..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <Table columns={columns} data={filteredData} selectable={true} selectedRows={selectedRows} onRowSelect={handleRowSelect} onSelectAll={handleSelectAll} />
        </div>
        {selectedRows.length > 0 && <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">
              تم اختيار {selectedRows.length} تقارير
            </h4>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={startProcess}>
                متابعة للتحقق من البيانات
              </button>
            </div>
          </div>}
      </div>;
  };
  const renderVerifyStep = () => {
    return <div>
        <div className="flex items-center mb-6">
          <button onClick={() => setCurrentStep('select')} className="flex items-center text-blue-600 hover:text-blue-800 ml-4">
            <ChevronLeft className="h-5 w-5 ml-1" />
            <span>العودة للاختيار</span>
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            التحقق من بيانات التقارير
          </h3>
        </div>
        <div className="space-y-6 mb-6">
          {selectedRows.map(rowIndex => {
          const report = reportData[rowIndex];
          return <div key={rowIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-lg text-gray-900">
                      {report.reportName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {report.referenceNo}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 text-sm ${verificationStatus[rowIndex] ? 'text-green-600' : 'text-red-600'}`}>
                      {verificationStatus[rowIndex] ? 'تم التحقق' : 'لم يتم التحقق'}
                    </span>
                    <div className="relative inline-block w-10 ml-2 align-middle select-none">
                      <input type="checkbox" id={`verification-${rowIndex}`} className="sr-only" checked={verificationStatus[rowIndex]} onChange={() => toggleVerificationStatus(rowIndex)} />
                      <label htmlFor={`verification-${rowIndex}`} className={`block overflow-hidden h-6 rounded-full cursor-pointer ${verificationStatus[rowIndex] ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`absolute block h-5 w-5 rounded-full bg-white border border-gray-300 top-0.5 transition-transform duration-200 ease-in-out ${verificationStatus[rowIndex] ? 'right-0.5 transform -translate-x-0' : 'right-7'}`}></span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">المصدر:</span>
                      <span className="text-sm font-medium">
                        {report.source}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">نوع المعدة:</span>
                      <span className="text-sm font-medium">
                        {report.equipmentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">الموقع:</span>
                      <span className="text-sm font-medium">
                        {report.location}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">الكمية:</span>
                      <span className="text-sm font-medium">
                        {report.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">الحالة:</span>
                      <span className="text-sm font-medium">
                        {report.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">التاريخ:</span>
                      <span className="text-sm font-medium">{report.date}</span>
                    </div>
                  </div>
                </div>
                {!verificationStatus[rowIndex] && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      يرجى التحقق من بيانات هذا التقرير قبل المتابعة
                    </p>
                  </div>}
              </div>;
        })}
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-3" onClick={() => setCurrentStep('select')}>
            العودة
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={startSendingProcess} disabled={Object.values(verificationStatus).some(status => !status)}>
            بدء عملية الإرسال
          </button>
        </div>
      </div>;
  };
  const renderSendStep = () => {
    return <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          جاري إرسال البيانات
        </h3>
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              يرجى الانتظار حتى اكتمال عملية إرسال البيانات إلى نظام الهيئة
            </p>
            <div className="space-y-6">
              <ProgressBar percentage={progressPercentage} stage={progressStage} />
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-700">
                  {progressStage === 'withdraw' && 'جاري سحب البيانات من النظام...'}
                  {progressStage === 'verify' && 'جاري التحقق من صحة البيانات...'}
                  {progressStage === 'send' && 'جاري إرسال البيانات إلى نظام الهيئة...'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={cancelProcess}>
              إلغاء العملية
            </button>
          </div>
        </div>
      </div>;
  };
  const renderResultStep = () => {
    return <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          نتيجة العملية
        </h3>
        <div className={`bg-white p-6 rounded-lg border ${processingResult === 'success' ? 'border-green-200' : 'border-red-200'} mb-6`}>
          <div className="text-center py-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${processingResult === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {processingResult === 'success' ? <Check className={`h-8 w-8 text-green-600`} /> : <AlertTriangle className={`h-8 w-8 text-red-600`} />}
            </div>
            <h4 className="text-xl font-medium mb-2">
              {processingResult === 'success' ? 'تمت العملية بنجاح' : 'فشلت العملية'}
            </h4>
            <p className="text-gray-600 mb-6">
              {processingResult === 'success' ? `تم إرسال ${selectedRows.length} تقارير بنجاح إلى نظام الهيئة` : 'حدث خطأ أثناء إرسال البيانات، يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني'}
            </p>
            {processingResult === 'success' && <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6 text-right">
                <p className="text-sm text-green-700">
                  رقم المرجع: REF-{new Date().getTime().toString().slice(-8)}
                </p>
                <p className="text-sm text-green-700">
                  تاريخ الإرسال: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>}
            {processingResult === 'error' && <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 text-right">
                <p className="text-sm text-red-700">
                  رمز الخطأ: ERR-{new Date().getTime().toString().slice(-6)}
                </p>
                <p className="text-sm text-red-700">
                  يرجى التواصل مع الدعم الفني وإرسال رمز الخطأ للمساعدة
                </p>
              </div>}
          </div>
          <div className="flex justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={resetWorkflow}>
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>;
  };
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'automatic':
        switch (currentStep) {
          case 'select':
            return renderSelectStep();
          case 'verify':
            return renderVerifyStep();
          case 'send':
            return renderSendStep();
          case 'result':
            return renderResultStep();
          default:
            return renderSelectStep();
        }
      case 'single':
        return <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                سحب تقرير واحد
              </h3>
              <p className="text-gray-600 mb-4">
                ابحث عن تقرير محدد وقم بسحبه وإرساله إلى نظام الهيئة
              </p>
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input type="text" placeholder="ادخل رقم التقرير أو اسمه..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
          </div>;
      case 'manual':
        return <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                سحب تقرير يدوي
              </h3>
              <p className="text-gray-600 mb-4">
                قم برفع ملفات التقرير من جهازك لإرسالها إلى نظام الهيئة
              </p>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    اسحب ملف Excel أو انقر للتحميل
                  </p>
                  <p className="text-gray-500 text-sm">
                    يجب أن يكون الملف بصيغة XLSX أو XLS
                  </p>
                  <input type="file" className="hidden" accept=".xlsx,.xls" id="excel-upload" />
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => document.getElementById('excel-upload')?.click()}>
                    اختيار ملف Excel
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 mb-2">
                    اسحب ملفات PDF المرتبطة أو انقر للتحميل
                  </p>
                  <p className="text-gray-500 text-sm">
                    يمكنك تحميل عدة ملفات PDF
                  </p>
                  <input type="file" className="hidden" accept=".pdf" multiple id="pdf-upload" />
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => document.getElementById('pdf-upload')?.click()}>
                    اختيار ملفات PDF
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" disabled>
                بدء عملية السحب والإرسال
              </button>
            </div>
          </div>;
    }
  };
  return <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">تقارير المعدات</h1>
        <p className="text-gray-600">إدارة سحب وإرسال تقارير نظام المعدات</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'automatic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => {
            setActiveTab('automatic');
            if (currentStep !== 'select') {
              resetWorkflow();
            }
          }}>
              سحب التقارير التلقائي
            </button>
            <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'single' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => {
            setActiveTab('single');
            resetWorkflow();
          }}>
              سحب تقرير واحد
            </button>
            <button className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${activeTab === 'manual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => {
            setActiveTab('manual');
            resetWorkflow();
          }}>
              سحب تقرير يدوي
            </button>
          </nav>
        </div>
        <div className="p-6">{renderActiveTabContent()}</div>
      </div>
    </div>;
};
export default MekyasReports;