import { Upload } from "lucide-react";

const ReportInfo = ({ form, setForm }: any) => {
    return (
        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">New Report</h3>
            <h4 className="text-md font-semibold text-gray-600">Report Information</h4>

            {/* Title, Purpose, Report Type */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Report Title
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, reportTitle: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Purpose of Valuation
                    </label>
                    <select
                        value={form.purpose}
                        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                    </select>
                </div>

                <div>
                    <label>* Value Assumption
                        <select className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Select</option>
                            <option>100%</option>
                            <option>50%</option>
                            <option>25%</option>
                        </select>
                    </label>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Report Type
                    </label>
                    <div className="flex gap-6">
                        {[
                            "Detailed Report",
                            "Report Summary",
                            "New Value Review",
                            "Review Without New Value",
                        ].map((type) => (
                            <label key={type} className="flex items-center gap-2 whitespace-nowrap">
                                <input
                                    type="radio"
                                    name="reportType"
                                    value={type}
                                    checked={form.reportType === type}
                                    onChange={(e) =>
                                        setForm({ ...form, reportType: e.target.value })
                                    }
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                </div>

            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Report Issue Date
                    </label>
                    <input
                        type="date"
                        value={form.issueDate}
                        onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Valuation Date
                    </label>
                    <input
                        type="date"
                        value={form.valueDate}
                        onChange={(e) => setForm({ ...form, valueDate: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Assumptions
                    </label>
                    <input
                        type="text"
                        value={form.assumptions}
                        onChange={(e) => setForm({ ...form, assumptions: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Currency, Assumptions, Final Opinion */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        Special Assumptions
                    </label>
                    <input
                        type="text"
                        value={form.assumptions}
                        onChange={(e) => setForm({ ...form, assumptions: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Currency
                    </label>
                    <select
                        value={form.currency}
                        onChange={(e) => setForm({ ...form, currency: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select</option>
                        <option value="sar">Saudi Riyal</option>
                        <option value="usd">US Dollar</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                        * Final Valuation Opinion
                    </label>
                    <input
                        type="text"
                        value={form.finalOpinion}
                        onChange={(e) => setForm({ ...form, finalOpinion: e.target.value })}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* File Upload */}
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-600">
                    Upload PDF File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                    <Upload className="h-20 w-6 mx-auto mb-2 text-gray-500" />
                    <p className="text-gray-500 text-sm mb-2">
                        Drag and drop a PDF file here or click to choose
                    </p>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>
                            setForm({ ...form, file: e.target.files?.[0] || null })
                        }
                        className="hidden"
                        id="fileUpload"
                    />
                    <label
                        htmlFor="fileUpload"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                    >
                        Choose File
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ReportInfo;
