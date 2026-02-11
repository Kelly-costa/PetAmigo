import { useState } from "react";
import api from "../services/api";

function Pets({ pets, setPets, clients }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [clientId, setClientId] = useState("");
  const [editingPetId, setEditingPetId] = useState(null);

  async function createPet() {
    if (!name || !type || !clientId) return alert("Preencha todos os campos");
    try {
      const res = await api.post("/pets", { name, type, clientId: Number(clientId) });
      setPets(prev => [...prev, res.data]);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar pet");
    }
  }

  async function updatePet() {
    if (!name || !type || !clientId) return alert("Preencha todos os campos");
    try {
      await api.put(`/pets/${editingPetId}`, { name, type, clientId: Number(clientId) });
      setPets(prev => prev.map(p => p.id === editingPetId ? { ...p, name, type, clientId: Number(clientId) } : p));
      resetForm();
      setEditingPetId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar pet");
    }
  }

  async function deletePet(id) {
    if (!confirm("Deseja excluir este pet?")) return;
    try {
      await api.delete(`/pets/${id}`);
      setPets(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir pet");
    }
  }

  function resetForm() {
    setName("");
    setType("");
    setClientId("");
  }

  function editPet(pet) {
    setEditingPetId(pet.id);
    setName(pet.name);
    setType(pet.type);
    setClientId(pet.clientId);
  }

  const sortedPets = [...pets].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mt-5">
      <h2>Pets</h2>

      <div className="card p-3 mb-3">
        <input className="form-control mb-2" placeholder="Nome do Pet" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Tipo (cachorro, gato...)" value={type} onChange={e => setType(e.target.value)} />
        <select className="form-control mb-2" value={clientId} onChange={e => setClientId(e.target.value)}>
          <option value="">Selecione o Tutor</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {editingPetId ? (
          <>
            <button className="btn btn-success me-2" onClick={updatePet}>Atualizar Pet</button>
            <button className="btn btn-secondary" onClick={() => { resetForm(); setEditingPetId(null); }}>Cancelar</button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={createPet}>Criar Pet</button>
        )}
      </div>

      <table className="table">
        <thead><tr><th>Nome</th><th>Tipo</th><th>Tutor</th><th>Ações</th></tr></thead>
        <tbody>
          {sortedPets.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{clients.find(c => c.id === p.clientId)?.name}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => editPet(p)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => deletePet(p.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Pets;
