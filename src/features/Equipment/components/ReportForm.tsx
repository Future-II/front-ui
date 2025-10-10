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
  title: string;
  purpose_id: string;
  value_premise_id: string;
  report_type: string;
  valued_at: string;
  submitted_at: string;
  inspection_date: string;
  assumptions: string;
  special_assumptions: string;
  value: string;
  owner_name: string;
  region: string;
  city: string;
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
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
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
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
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
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300'
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
          <div className={`flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all ${
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
  onFieldChange,
  onValuerAdd,
  onValuerDelete,
  onClientUpdate,
  onValuerUpdate,
  onSaveAndContinue
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Valuation Report</h1>
          <p className="text-gray-600">Complete all required fields to generate your report</p>
        </div>

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
              label="Purpose ID"
              required
              value={formData.purpose_id}
              onChange={(e: any) => onFieldChange('purpose_id', e.target.value)}
              options={[
                { value: 'to set', label: 'Select Purpose' },
                { value: '1', label: '1 - Selling' },
                { value: '2', label: '2 - Purchase' },
                { value: '5', label: '5 - Investment' },
                { value: '6', label: '6 - Mortgage' },
                { value: '8', label: '8 - Financial Reporting' },
                { value: '9', label: '9 - Tax' },
                { value: '10', label: '10 - Insurance' },
                { value: '12', label: '12 - Legal' },
                { value: '14', label: '14 - Other' }
              ]}
              error={errors.purpose_id}
            />
            
            <SelectField
              label="Value Premise ID"
              required
              value={formData.value_premise_id}
              onChange={(e: any) => onFieldChange('value_premise_id', e.target.value)}
              options={[
                { value: 'to set', label: 'Select Value Premise' },
                { value: '1', label: '1 - Market Value' },
                { value: '2', label: '2 - Investment Value' },
                { value: '3', label: '3 - Value in Use' },
                { value: '4', label: '4 - Liquidation Value' },
                { value: '5', label: '5 - Fair Value' }
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
                { value: 'detailed', label: 'Detailed Report' },
                { value: 'summary', label: 'Report Summary' },
                { value: 'reviewNew', label: 'Review with New Value' },
                { value: 'reviewWithout', label: 'Review without New Value' }
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
            
            <InputField
              label="Inspection Date"
              required
              type="date"
              value={formData.inspection_date}
              onChange={(e: any) => onFieldChange('inspection_date', e.target.value)}
              error={errors.inspection_date}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <TextAreaField
              label="Assumptions"
              rows={4}
              value={formData.assumptions}
              onChange={(e: any) => onFieldChange('assumptions', e.target.value)}
              placeholder="Enter general assumptions for the valuation"
            />
            
            <TextAreaField
              label="Special Assumptions"
              rows={4}
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
                { value: 'Saudi riyal', label: 'Saudi Riyal' },
                { value: 'USD', label: 'US Dollar' },
                { value: 'EUR', label: 'Euro' }
              ]}
            />
          </div>
        </Section>

        <Section title="Owner Information">
          <div className="max-w-2xl">
            <InputField
              label="Owner Name"
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
      value={formData.clients[0]?.client_name || ''} // ✅ Use first client
      onChange={(e: any) => onClientUpdate(0, 'client_name', e.target.value)} // ✅ Use client update function
      error={errors['client_0_client_name']} // ✅ Use correct error key
      placeholder="Enter client name"
    />
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-2xl">
    <InputField
      label="Telephone"
      required
      type="tel"
      value={formData.clients[0]?.telephone_number || ''} // ✅ Use first client
      onChange={(e: any) => onClientUpdate(0, 'telephone_number', e.target.value)} // ✅ Use client update function
      error={errors['client_0_telephone_number']} // ✅ Use correct error key
      placeholder="e.g. +966500000000"
    />
    
    <InputField
      label="Email"
      required
      type="email"
      value={formData.clients[0]?.email_address || ''} // ✅ Use first client
      onChange={(e: any) => onClientUpdate(0, 'email_address', e.target.value)} // ✅ Use client update function
      error={errors['client_0_email_address']} // ✅ Use correct error key
      placeholder="e.g. example@domain.com"
    />
  </div>
</Section>

        <Section title="Valuer Data">
          <div className="space-y-6">
            {formData.valuers.map((valuer, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Valuer {index + 1}</h4>
                  {formData.valuers.length > 1 && (
                    <button
                      onClick={() => onValuerDelete(index)}
                      className="px-4 py-2 text-sm rounded-lg border-2 border-red-400 text-red-600 hover:bg-red-50 transition-all"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SelectField
                    label="Valuer Name"
                    required
                    value={valuer.valuer_name}
                    onChange={(e: any) => onValuerUpdate(index, 'valuer_name', e.target.value)}
                    options={[
                      { value: '', label: 'Select Valuer' },
                      { value: '4210000271', label: '4210000271 - عبدالعزيز سليمان عبدالله الزيد' },
                      { value: '4210000272', label: '4210000272 - محمد أحمد علي' },
                      { value: '4210000273', label: '4210000273 - سارة خالد الحربي' }
                    ]}
                    error={errors[`valuer_${index}_valuer_name`]}
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
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={onValuerAdd}
            className="mt-6 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all font-medium"
          >
            <Plus size={20} />
            Add Another Valuer
          </button>
        </Section>

        <Section title="Location Information">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-2xl">
            <InputField
              label="Region"
              required
              type="text"
              value={formData.region}
              onChange={(e: any) => onFieldChange('region', e.target.value)}
              error={errors.region}
              placeholder="Enter region"
            />
            
            <InputField
              label="City"
              required
              type="text"
              value={formData.city}
              onChange={(e: any) => onFieldChange('city', e.target.value)}
              error={errors.city}
              placeholder="Enter city"
            />
          </div>
        </Section>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onSaveAndContinue}
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all text-lg"
          >
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;