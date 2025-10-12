import React from 'react';

interface Client {
  client_name: string;
  telephone_number: string;
  email_address: string;
}

interface FormData {
  title: string;
  purpose_id: string;
  value_premise_id: string;
  report_type: string;
  valued_at: string;
  submitted_at: string;
  assumptions: string;
  special_assumptions: string;
  value: string;
  client_name: string;
  owner_name: string;
  telephone: string;
  email: string;
  valuation_currency: string;
  clients: Client[];
  has_other_users: boolean;
  report_users: string[];
}

interface ReportFormProps {
  formData: FormData;
  errors: { [key: string]: string };
  step1Validated: boolean;
  onFormDataChange: (updates: Partial<FormData>) => void;
  onFieldChange: (field: keyof FormData, value: any) => void;
  onClientAdd: () => void;
  onClientDelete: (index: number) => void;
  onClientUpdate: (index: number, field: keyof Client, value: string) => void;
  onUserAdd: () => void;
  onUserDelete: (index: number) => void;
  onUserUpdate: (index: number, value: string) => void;
  onValidateData: () => void;
  onContinue: () => void;
}

const InputField = ({
  label,
  required = false,
  error,
  className = '',
  ...props
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  [key: string]: any
}) => (
  <div className={`mb-5 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
    />
    {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  required = false,
  options,
  error,
  className = '',
  ...props
}: {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
  error?: string;
  className?: string;
  [key: string]: any
}) => (
  <div className={`mb-5 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
  </div>
);

const TextAreaField = ({
  label,
  required = false,
  error,
  className = '',
  ...props
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  [key: string]: any
}) => (
  <div className={`mb-5 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`}
    />
    {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
  </div>
);

const RadioGroup = ({
  label,
  options,
  value,
  onChange
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="flex flex-wrap gap-3">
      {options.map(option => (
        <label key={option.value} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${value === option.value
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
            }`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${value === option.value ? 'border-blue-500' : 'border-gray-400'
              }`}>
              {value === option.value && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <span className={`text-sm ${value === option.value ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
              {option.label}
            </span>
          </div>
        </label>
      ))}
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
      {title}
    </h3>
    {children}
  </div>
);

const ReportForm: React.FC<ReportFormProps> = ({
  formData,
  errors,
  step1Validated,
  onFieldChange,
  onClientUpdate,
  onValidateData,
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Valuation Report</h1>
          <p className="text-gray-600">Complete all required fields to generate your report</p>
        </div>

        {step1Validated && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-700">Data Validated Successfully</p>
                <p className="text-sm text-gray-600">All required fields are filled correctly. Click Continue to proceed.</p>
              </div>
            </div>
          </div>
        )}

        <Section title="Report Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-2">
              <InputField
                label="Report Title"
                required
                type="text"
                value={formData.title}
                onChange={(e: any) => onFieldChange('title', e.target.value)}
                error={errors.title}
                placeholder="Enter a descriptive title for this report"
              />
            </div>

            <SelectField
              label="Valuation Purpose"
              required
              value={formData.purpose_id}
              onChange={(e: any) => onFieldChange('purpose_id', e.target.value)}
              options={[
                { value: 'to set', label: 'Select' },
                { value: '1', label: 'Selling' },
                { value: '2', label: 'Buying' },
                { value: '5', label: 'Rent Value' },
                { value: '6', label: 'Insurance' },
                { value: '8', label: 'Accounting Purposes' },
                { value: '9', label: 'Financing' },
                { value: '10', label: 'Disputes and Litigation' },
                { value: '12', label: 'Tax Related Valuations' },
                { value: '14', label: 'Other' }
              ]}
              error={errors.purpose_id}
            />

            <SelectField
              label="Value Premise"
              required
              value={formData.value_premise_id}
              onChange={(e: any) => onFieldChange('value_premise_id', e.target.value)}
              options={[
                { value: 'to set', label: 'Select' },
                { value: '1', label: 'Highest and Best Use' },
                { value: '2', label: 'Current Use' },
                { value: '3', label: 'Orderly Liquidation' },
                { value: '4', label: 'Forced Sale' },
                { value: '5', label: 'Other' }
              ]}
              error={errors.value_premise_id}
            />
          </div>

          <div className="mb-6">
            <RadioGroup
              label="Report Type"
              value={formData.report_type}
              onChange={(value) => onFieldChange('report_type', value)}
              options={[
                { value: 'تقرير مفصل', label: 'Detailed Report' },
                { value: 'ملخص التقرير', label: 'Report Summary' },
                { value: 'مراجعة مع قيمة جديدة', label: 'Review with New Value' },
                { value: 'مراجعة بدون قيمة جديدة', label: 'Review without New Value' }
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <InputField
              label="Valued At"
              required
              type="date"
              value={formData.valued_at}
              onChange={(e: any) => onFieldChange('valued_at', e.target.value)}
              error={errors.valued_at}
            />

            <InputField
              label="Submitted At"
              required
              type="date"
              value={formData.submitted_at}
              onChange={(e: any) => onFieldChange('submitted_at', e.target.value)}
              error={errors.submitted_at}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <InputField
              label="Assumptions"
              value={formData.assumptions}
              onChange={(e: any) => onFieldChange('assumptions', e.target.value)}
              placeholder="Enter general assumptions for the valuation"
            />

            <InputField
              label="Special Assumptions"
              value={formData.special_assumptions}
              onChange={(e: any) => onFieldChange('special_assumptions', e.target.value)}
              placeholder="Enter any special assumptions or conditions"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputField
              label="Value"
              required
              type="text"
              value={formData.value}
              onChange={(e: any) => onFieldChange('value', e.target.value)}
              error={errors.value}
              placeholder="Enter final value"
            />

            <SelectField
              label="Valuation Currency"
              required
              value={formData.valuation_currency}
              onChange={(e: any) => onFieldChange('valuation_currency', e.target.value)}
              options={[
                { value: 'to set', label: 'Select' },
                { value: '1', label: 'Saudi Riyal'},
                { value: '2', label: 'US Dollars' },
                { value: '3', label: 'UA Dirhams' },
                { value: '4', label: 'Euro' },
                { value: '5', label: 'Pound Sterling' },
                { value: '6', label: 'Sudanese Pound' },
              ]}
              error={errors.valuation_currency}
            />
          </div>
        </Section>

        <Section title="Owner Information">
          <div className="max-w-2xl">
            <InputField
              label="Owner Name (in assets)"
              required
              type="text"
              value={formData.owner_name}
              onChange={(e: any) => onFieldChange('owner_name', e.target.value)}
              error={errors.owner_name}
              placeholder="Enter owner name"
            />
          </div>
        </Section>

        <Section title="Client Information">
          <div className="max-w-2xl mb-6">
            <InputField
              label="Client Name"
              required
              type="text"
              value={formData.client_name || ''}
              onChange={(e: any) => onFieldChange('client_name', e.target.value)}
              error={errors['client_name']}
              placeholder="Enter client name"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-2xl">
            <InputField
              label="Telephone"
              required
              type="tel"
              value={formData.telephone || ''}
              onChange={(e: any) => onFieldChange('telephone', e.target.value)}
              error={errors['telephone']}
              placeholder="e.g. +966500000000"
            />

            <InputField
              label="Email"
              required
              type="email"
              value={formData.email || ''}
              onChange={(e: any) => onFieldChange('email', e.target.value)}
              error={errors['email']}
              placeholder="e.g. example@domain.com"
            />
          </div>
        </Section>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onValidateData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Validate Data
          </button>
          
          <button
            onClick={onContinue}
            disabled={!step1Validated}
            className={`px-10 py-4 rounded-lg font-semibold shadow-lg transition-all text-lg ${
              step1Validated
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;