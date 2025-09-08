import { useState } from 'react';
import {
  Clock,
  Eye,
  RotateCcw,
  CheckCircle,
  Send,
  Search,
  FileText,
  MapPin,
  Phone,
  User,
  PenSquare,
  Hash,
  Building,
  Trash2,
  Image
} from 'lucide-react';

const JadeerReports = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const reportData = [
    {
      id: 1,
      bank: 'Bank Aljazira',
      reportType: 'Brief Report - Buildings',
      referenceNumber: '5516',
      assignmentNumber: '244271',
      assignmentDate: '08-25-2025',
      instrumentNumber: '688736225940000',
      partNumber: '3',
      clientName: 'Abdulrahman bin Mohammed bin Abdulrahman Al-Ubaid',
      propertyType: 'Land',
      address: 'Al Khobar - Al Aqrabiyah',
      contactNumber: '0505825013',
      inspector: 'Abdullah Abdulrahman Al-Nahdi',
      lastUpdated: '08-25-2025 07:00 PM - Abdullah Abdulrahman Al-Nahdi',
      value: '26,374.400',
      status: 'Review',
      statusColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hours: '8 hours',
      timeDetail: '04:05:15',
      pictures: '20'
    },
    {
      id: 2,
      bank: 'Saudi French Bank',
      reportType: 'Brief Report - Buildings',
      referenceNumber: '5517',
      assignmentNumber: '202594832',
      assignmentDate: '08-25-2025',
      instrumentNumber: '536114497484',
      partNumber: '309',
      clientName: 'Ithaa Riyadh Real Estate Company',
      propertyType: 'Residential Villa',
      address: 'Dammam - King Fahd District',
      contactNumber: '0556233129',
      inspector: 'Abdullah Abdulrahman Al-Nahdi',
      lastUpdated: '08-25-2025 06:44 PM - Abdullah Abdulrahman Al-Nahdi',
      value: '364,120.00',
      status: 'Review',
      statusColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hours: '8 hours',
      timeDetail: '04:23:59',
      pictures: '52'
    },
    {
      id: 3,
      bank: 'Individual clients',
      reportType: 'Brief Report - Buildings',
      referenceNumber: '5508',
      assignmentNumber: '5508',
      assignmentDate: '08-21-2025',
      instrumentNumber: '811603902118',
      partNumber: '3',
      clientName: 'Mowli bint Ibrahim bin Abdulaziz Al-Ibrahim',
      propertyType: 'Land with buildings',
      address: 'Diriyah - Al-Ammariyan',
      contactNumber: '0505844674',
      inspector: 'Abdulaziz Khaled Al-Khaled',
      lastUpdated: '08-25-2025 04:29 PM - Omar Ali Ansari',
      value: '23,439,826.00',
      status: 'Auditing',
      statusColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      hours: '4 days and 4 hours',
      timeDetail: '09:35:37',
      pictures: '29'
    }
  ];

  // Only filter by bank, referenceNumber, or assignmentNumber
  const filteredReports = reportData.filter(report => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      report.bank.toLowerCase().includes(query) ||
      report.referenceNumber.toLowerCase().includes(query) ||
      report.assignmentNumber.toLowerCase().includes(query)
    );
  });

  const statusStats = [
    { label: 'New', count: 2, color: 'text-orange-500', icon: Clock },
    { label: 'Preview', count: 2, color: 'text-blue-500', icon: Eye },
    { label: 'Review', count: 2, color: 'text-purple-500', icon: RotateCcw },
    { label: 'Auditing', count: 3, color: 'text-teal-500', icon: CheckCircle },
    { label: 'Sent', count: 29, color: 'text-green-500', icon: Send }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Worthy reports</h1>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Search by assignment name, number, or reference number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Search className="w-4 h-4" />
              <span>search</span>
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {statusStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border">
                <IconComponent className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className={`text-sm font-medium ${stat.color} mb-1`}>{stat.label}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-white rounded-t-lg border-b">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-semibold text-gray-800">
          <div className="col-span-2">Assignment</div>
          <div className="col-span-3">the details</div>
          <div className="col-span-1 text-center">value</div>
          <div className="col-span-2 text-center">the condition</div>
          <div className="col-span-2 text-center">procedures</div>
          <div className="col-span-2 text-center">the pictures</div>
        </div>
      </div>

      {/* Report Rows */}
      <div className="bg-white rounded-b-lg shadow-sm">
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <div
              key={report.id}
              className={`grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} items-start`}
            >
              {/* Assignment Column */}
              <div className="col-span-2 space-y-1">
                <div className="font-semibold text-purple-600 text-lg">{report.bank}</div>
                <div className="text-sm text-gray-600">{report.reportType}</div>
                <div className="text-xs text-gray-500">Reference Number: {report.referenceNumber}</div>
                <div className="text-xs text-gray-500">Assignment number: {report.assignmentNumber}</div>
                <div className="text-xs text-gray-500">Assignment date: {report.assignmentDate}</div>
              </div>

              {/* Details Column */}
              <div className="col-span-3 space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Instrument Number: {report.instrumentNumber}</span>
                </div>
                <div className="text-gray-600">Part Number: {report.partNumber}</div>
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Client Name: {report.clientName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Property Type: {report.propertyType}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Address: {report.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Contact number: {report.contactNumber}</span>
                </div>
                <div className="text-gray-600">Inspector: {report.inspector}</div>
                <div className="text-xs text-gray-500">Last updated: {report.lastUpdated}</div>
              </div>

              {/* Value Column */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="font-bold text-lg text-gray-500">{report.value}</div>
              </div>

              {/* Condition Column  */}
              <div className="col-span-2 flex flex-col items-center justify-center text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${report.bgColor} ${report.statusColor}`}>
                  {report.status}
                </div>
                <div className="text-xs text-red-700 mt-1">{report.hours}</div>
                <div className="text-xs text-green-700">{report.timeDetail}</div>
              </div>

              {/* Procedures Column  */}
              <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="flex space-x-2 justify-center">
                  <button aria-label="view" className="w-8 h-8 rounded-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button aria-label="edit" className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-colors">
                    <PenSquare className="w-4 h-4" />
                  </button>
                  <button aria-label="delete" className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button aria-label="approve" className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
         
                <div className="mt-2">
                  <button aria-label="report-file" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pictures Column */}
              <div className="col-span-2 flex items-center justify-center space-x-3">
                <div className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                  <Image className="w-4 h-4" />
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <span className="font-medium">#</span>
                  <span>{report.pictures}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-lg font-medium mb-2">No reports found</div>
            <div className="text-sm">
              Try searching with assignment names like "Bank Aljazira", "Saudi French Bank", or "Individual clients"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JadeerReports;
