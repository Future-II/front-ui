import { useState } from "react";

const ClientInfo = ({ form, setForm }: any) => {
  const [otherUsers, setOtherUsers] = useState<string[]>([]);
  const [showOtherUserInput, setShowOtherUserInput] = useState(false);
  const [currentOtherUser, setCurrentOtherUser] = useState("");

  // Ensure clients is an array
  if (!form.clients) {
    setForm({ ...form, clients: [{ name: "", phone: "", email: "" }] });
  }

  const handleClientChange = (index: number, field: string, value: string) => {
    const updatedClients = [...form.clients];
    updatedClients[index][field] = value;
    setForm({ ...form, clients: updatedClients });
  };

  const addClient = () => {
    setForm({ ...form, clients: [...form.clients, { name: "", phone: "", email: "" }] });
  };

  const removeClient = () => {
    // Remove the last client only if there is more than one
    if (form.clients.length > 1) {
      const updatedClients = form.clients.slice(0, -1);
      setForm({ ...form, clients: updatedClients });
    }
  };

  const addOtherUser = () => {
    if (currentOtherUser.trim() === "") return;
    setOtherUsers([...otherUsers, currentOtherUser.trim()]);
    setCurrentOtherUser("");
  };

  const removeOtherUser = (index: number) => {
    const updatedUsers = otherUsers.filter((_, i) => i !== index);
    setOtherUsers(updatedUsers);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-md font-semibold text-gray-700">Client Information</h3>

      {form.clients?.map((client: any, index: number) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="* Client Name"
            value={client.name}
            onChange={(e) => handleClientChange(index, "name", e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="* Phone Number"
            value={client.phone}
            onChange={(e) => handleClientChange(index, "phone", e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="* Email Address"
            value={client.email}
            onChange={(e) => handleClientChange(index, "email", e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <div className="flex items-center gap-3 mt-2">
        <button
          type="button"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={addClient}
        >
          Add Client
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={removeClient}
        >
          Remove Client
        </button>

        <label className="flex items-center gap-2 text-gray-600 text-sm ml-4">
          <input
            type="checkbox"
            checked={showOtherUserInput}
            onChange={() => setShowOtherUserInput(!showOtherUserInput)}
          />
          Other beneficiaries for the report
        </label>
      </div>

      {showOtherUserInput && (
        <div className="mt-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Report User"
            value={currentOtherUser}
            onChange={(e) => setCurrentOtherUser(e.target.value)}
            className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            onClick={addOtherUser}
          >
            Add Report User
          </button>
        </div>
      )}

      {otherUsers.length > 0 && (
        <div className="mt-2 space-y-1 text-gray-700">
          <strong>Added Report Users:</strong>
          <ul className="list-disc list-inside">
            {otherUsers.map((user, idx) => (
              <li key={idx} className="flex items-center justify-between">
                {user}
                <button
                  type="button"
                  className="px-2 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 ml-2"
                  onClick={() => removeOtherUser(idx)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClientInfo;
