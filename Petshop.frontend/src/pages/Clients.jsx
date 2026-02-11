import { useState } from "react";
import api from "../services/api";

function Clients({ clients, setClients, pets, onClientDeleted }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingClientId, setEditingClientId] = useState(null);
  const [showPetsFor, setShowPetsFor] = useState(null);

  async function createClient() {
    if (!name || !email) return alert("Preencha todos os campos");
    try {
      const res = await api.post("/clients", { name, email });
      setClients(prev => [...prev, res.data]);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar cliente");
    }
  }

  async function updateClient() {
    if (!name || !email) return alert("Preencha todos os campos");
    try {
      await api.put(`/clients/${editingClientId}`, { name, email });
      setClients(prev =>
        prev.map(c => (c.id === editingClientId ? { ...c, name, email } : c))
      );
      resetForm();
      setEditingClientId(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar cliente");
    }
  }

  async function deleteClient(id) {
    if (!confirm("Deseja excluir este cliente?")) return;
    try {
      await api.delete(`/clients/${id}`);
      onClientDeleted && onClientDeleted(id);
      if (showPetsFor === id) setShowPetsFor(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir cliente");
    }
  }

  function resetForm() {
    setName("");
    setEmail("");
  }

  function editClient(client) {
    setEditingClientId(client.id);
    setName(client.name);
    setEmail(client.email);
  }

  function viewPets(clientId) {
    setShowPetsFor(clientId);
  }

  const sortedClients = [...clients].sort((a, b) => a.name.localeCompare(b.name));

  const clientPets = showPetsFor
    ? pets.filter(p => p.clientId === showPetsFor).sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <div className="container mt-5">
      <h2>Clientes</h2>

      <div className="card p-3 mb-3">
        <input
          className="form-control mb-2"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {editingClientId ? (
          <>
            <button className="btn btn-success me-2" onClick={updateClient}>
              Atualizar Cliente
            </button>
            <button className="btn btn-secondary" onClick={() => { resetForm(); setEditingClientId(null); }}>
              Cancelar
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={createClient}>Criar Cliente</button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr><th>Nome</th><th>Email</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {sortedClients.map(client => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => editClient(client)}>Editar</button>
                <button className="btn btn-danger btn-sm me-1" onClick={() => deleteClient(client.id)}>Excluir</button>
                <button className="btn btn-info btn-sm" onClick={() => viewPets(client.id)}>Ver Pets</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPetsFor && (
        <div className="card p-3 mt-3">
          <h5>Pets do Cliente:</h5>
          {clientPets.length === 0 ? (
            <p>Este cliente não possui pets cadastrados.</p>
          ) : (
            <ul>{clientPets.map(p => <li key={p.id}>{p.name} ({p.type})</li>)}</ul>
          )}
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPetsFor(null)}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default Clients;
