import React, { useState } from "react";

interface AddMinerFormProps {
  onSubmit: (newIp: string) => Promise<void>;
}

const AddMinerForm: React.FC<AddMinerFormProps> = ({ onSubmit }) => {
  const [newIp, setNewIp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newIp);
    setNewIp("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={newIp}
        onChange={(e) => { setNewIp(e.target.value); }}
        placeholder="Enter IP address"
        className="input input-bordered w-full"
      />
      <button type="submit" className="btn btn-primary">
        Add Miner
      </button>
    </form>
  );
};

export default AddMinerForm;
