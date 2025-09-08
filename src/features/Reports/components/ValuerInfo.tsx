import { useEffect } from "react";

const ValuerInfo = ({ form, setForm }: any) => {
  // Initialize valuers only once
  useEffect(() => {
    if (!form.valuers || form.valuers.length === 0) {
      setForm({ ...form, valuers: [{ name: "", share: 100 }] });
    }
  }, []);

  const handleValuerChange = (index: number, field: string, value: string | number) => {
    const updatedValuers = [...form.valuers];
    updatedValuers[index][field] = field === "share" ? Number(value) : value;
    setForm({ ...form, valuers: updatedValuers });
  };

  const addValuer = () => {
    const totalShare = form.valuers.reduce((acc: number, v: any) => acc + v.share, 0);
    if (totalShare >= 100) return; // can't add more if 100% reached
    setForm({ ...form, valuers: [...form.valuers, { name: "", share: 0 }] });
  };

  const removeValuer = (index: number) => {
    if (form.valuers.length > 1) {
      const updatedValuers = form.valuers.filter((_: any, i: number) => i !== index);
      setForm({ ...form, valuers: updatedValuers });
    }
  };

  const totalShare = form.valuers?.reduce((acc: number, v: any) => acc + Number(v.share), 0) || 0;

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-md font-semibold text-gray-700">Valuer Information</h3>

      {form.valuers?.map((valuer: any, index: number) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={valuer.name}
            onChange={(e) => handleValuerChange(index, "name", e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">* Select Valuer</option>
            <option value="valuer1">Valuer 1</option>
            <option value="valuer2">Valuer 2</option>
          </select>

          <input
            type="number"
            value={valuer.share}
            min={0}
            max={100}
            onChange={(e) => {
              const newShare = Number(e.target.value);
              const otherShares = form.valuers
                .filter((_: any, i: number) => i !== index)
                .reduce((acc: number, v: any) => acc + v.share, 0);
              if (otherShares + newShare <= 100) {
                handleValuerChange(index, "share", newShare);
              }
            }}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={addValuer}
        >
          Add Valuer
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => removeValuer(form.valuers.length - 1)}
          disabled={form.valuers.length <= 1}
        >
          Remove Valuer
        </button>

        <span className="text-gray-600 text-sm ml-2">
          Total Share: {totalShare}%
        </span>
      </div>

      {totalShare > 100 && (
        <p className="text-red-600 text-sm">Total share exceeds 100%!</p>
      )}
    </div>
  );
};

export default ValuerInfo;
