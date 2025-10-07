import React from 'react';
import { Plus } from 'lucide-react';

interface Client {
  client_name: string;
  telephone_number: string;
  email_address: string;
}

interface Valuer {
  valuer_name: string;
  contribution_percentage: number;
}

interface FormData {
  report_title: string;
  valuation_purpose: string;
  value_premise: string;
  report_type: string;
  valuation_date: string;
  report_issuing_date: string;
  assumptions: string;
  special_assumptions: string;
  final_value: string;
  valuation_currency: string;
  clients: Client[];
  has_other_users: boolean;
  report_users: string[];
  valuers: Valuer[];
}

interface ReportFormProps {
  formData: FormData;
  errors: { [key: string]: string };
  onFormDataChange: (updates: Partial<FormData>) => void;
  onFieldChange: (field: keyof FormData, value: any) => void;
  onClientAdd: () => void;
  onClientDelete: (index: number) => void;
  onClientUpdate: (index: number, field: keyof Client, value: string) => void;
  onUserAdd: () => void;
  onUserDelete: (index: number) => void;
  onUserUpdate: (index: number, value: string) => void;
  onValuerAdd: () => void;
  onValuerDelete: (index: number) => void;
  onValuerUpdate: (index: number, field: keyof Valuer, value: string | number) => void;
  onSaveAndContinue: () => void;
}

const InputField = ({ 
  label, 
  required = false, 
  error, 
  ...props 
}: { 
  label: string; 
  required?: boolean; 
  error?: string; 
  [key: string]: any 
}) => (
  <div className="mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      {...props}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 h-4">{error}</p>}
  </div>
);

const SelectField = ({ 
  label, 
  required = false, 
  options, 
  error,
  ...props 
}: { 
  label: string; 
  required?: boolean; 
  options: { value: string; label: string }[];
  error?: string;
  [key: string]: any 
}) => (
  <div className="mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...props}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
      }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs mt-1 h-4">{error}</p>}
  </div>
);

const TextAreaField = ({ 
  label, 
  required = false, 
  error,
  ...props 
}: { 
  label: string; 
  required?: boolean; 
  error?: string;
  [key: string]: any 
}) => (
  <div className="mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1 h-4">{error}</p>}
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
  <div className="mb-1">
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="flex flex-wrap gap-4">
      {options.map(option => (
        <label key={option.value} className="flex items-center cursor-pointer group">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
            value === option.value 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              value === option.value ? 'border-blue-500' : 'border-gray-400'
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
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b border-gray-200">
      {title}
    </h3>
    {children}
  </div>
);

const ReportForm: React.FC<ReportFormProps> = ({
  formData,
  errors,
  onFieldChange,
  onClientAdd,
  onClientDelete,
  onClientUpdate,
  onUserAdd,
  onUserDelete,
  onUserUpdate,
  onValuerAdd,
  onValuerDelete,
  onValuerUpdate,
  onSaveAndContinue
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Report Information */}
        <Section title="Report Information">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <InputField
              label="Report Title"
              required
              type="text"
              value={formData.report_title}
              onChange={(e: any) => onFieldChange('report_title', e.target.value)}
              error={errors.report_title}
            />
            
            <SelectField
              label="Purpose of Assessment"
              required
              value={formData.valuation_purpose}
              onChange={(e: any) => onFieldChange('valuation_purpose', e.target.value)}
              options={[
                { value: '', label: 'Select' },
                { value: 'Selling', label: 'Selling' }
              ]}
            />
            
            <SelectField
              label="Value Hypothesis"
              required
              value={formData.value_premise}
              onChange={(e: any) => onFieldChange('value_premise', e.target.value)}
              options={[
                { value: '', label: 'Select' },
                { value: 'Current Use', label: 'Current Use' }
              ]}
            />
          </div>

          <div className="mb-6">
            <RadioGroup
              label="Report Type"
              value={formData.report_type}
              onChange={(value) => onFieldChange('report_type', value)}
              options={[
                { value: 'detailed', label: 'Detailed Report' },
                { value: 'summary', label: 'Report Summary' },
                { value: 'reviewNew', label: 'Review with New Value' },
                { value: 'reviewWithout', label: 'Review without New Value' }
              ]}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <InputField
              label="Evaluation Date"
              required
              type="date"
              value={formData.valuation_date}
              onChange={(e: any) => onFieldChange('valuation_date', e.target.value)}
              error={errors.valuation_date}
            />
            
            <InputField
              label="Report Release Date"
              required
              type="date"
              value={formData.report_issuing_date}
              onChange={(e: any) => onFieldChange('report_issuing_date', e.target.value)}
              error={errors.report_issuing_date}
            />
            
            <TextAreaField
              label="Assumptions"
              rows={1}
              value={formData.assumptions}
              onChange={(e: any) => onFieldChange('assumptions', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <TextAreaField
              label="Special Assumptions"
              rows={1}
              value={formData.special_assumptions}
              onChange={(e: any) => onFieldChange('special_assumptions', e.target.value)}
            />
            
            <TextAreaField
              label="Final Opinion on Value"
              required
              rows={1}
              value={formData.final_value}
              onChange={(e: any) => onFieldChange('final_value', e.target.value)}
              error={errors.final_value}
            />
            
            <SelectField
              label="Evaluation Currency"
              required
              value={formData.valuation_currency}
              onChange={(e: any) => onFieldChange('valuation_currency', e.target.value)}
              options={[
                { value: 'Saudi Riyal', label: 'Saudi Riyal' }
              ]}
            />
          </div>
        </Section>

        <Section title="Customer Data">
          {formData.clients.map((client, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-6 items-start">
              <InputField
                label="Customer Name"
                required
                type="text"
                value={client.client_name}
                onChange={(e: any) => onClientUpdate(index, 'client_name', e.target.value)}
                error={errors[`client_${index}_client_name`]}
              />
              
              <InputField
                label="Phone Number"
                required
                type="text"
                value={client.telephone_number}
                onChange={(e: any) => onClientUpdate(index, 'telephone_number', e.target.value)}
                error={errors[`client_${index}_telephone_number`]}
              />
              
              <InputField
                label="Email"
                required
                type="email"
                value={client.email_address}
                onChange={(e: any) => onClientUpdate(index, 'email_address', e.target.value)}
                error={errors[`client_${index}_email_address`]}
              />
              
              <div className="flex items-end h-[72px]">
                <button
                  onClick={() => onClientDelete(index)}
                  disabled={formData.clients.length === 1}
                  className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                    formData.clients.length === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-red-400 text-red-600 hover:bg-red-50'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={onClientAdd}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm"
          >
            <Plus size={18} />
            Add Client
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_other_users}
                onChange={(e) => onFieldChange('has_other_users', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm font-medium text-gray-700">Other Users Report</span>
            </label>
          </div>

          {formData.has_other_users && (
            <div className="mt-4 pl-8">
              {formData.report_users.map((user, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-4 items-start">
                  <InputField
                    label="Report Username"
                    required
                    type="text"
                    value={user}
                    onChange={(e: any) => onUserUpdate(index, e.target.value)}
                  />
                  
                  <div className="flex items-end h-[72px]">
                    <button
                      onClick={() => onUserDelete(index)}
                      disabled={formData.report_users.length === 1}
                      className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                        formData.report_users.length === 1
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-red-400 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                onClick={onUserAdd}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm"
              >
                Add User
              </button>
            </div>
          )}
        </Section>

        {/* Resident Data */}
        <Section title="Resident Data">
          {formData.valuers.map((valuer, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-6 items-start">
              <SelectField
                label="Valuer Name"
                required
                value={valuer.valuer_name}
                onChange={(e: any) => onValuerUpdate(index, 'valuer_name', e.target.value)}
                options={[
                  { value: '', label: 'Select' },
                  { value: '4210000271', label: '4210000271 - عبدالعزيز سليمان عبدالله الزيد' }
                ]}
              />
              
              <SelectField
                label="Contribution Percentage"
                required
                value={valuer.contribution_percentage.toString()}
                onChange={(e: any) => onValuerUpdate(index, 'contribution_percentage', Number(e.target.value))}
                options={[
                  { value: '100', label: '100%' },
                  { value: '75', label: '75%' },
                  { value: '50', label: '50%' },
                  { value: '25', label: '25%' }
                ]}
              />
              
              <div className="flex items-end h-[72px]">
                <button
                  onClick={() => onValuerDelete(index)}
                  disabled={formData.valuers.length === 1}
                  className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                    formData.valuers.length === 1
                      ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'border-red-400 text-red-600 hover:bg-red-50'
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={onValuerAdd}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all text-sm"
          >
            Add Resident
          </button>
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onSaveAndContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;