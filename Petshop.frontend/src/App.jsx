import { useState, useEffect } from "react";
import api from "./services/api";
import Clients from "./pages/Clients";
import Pets from "./pages/Pets";

function App() {
  const [clients, setClients] = useState([]);
  const [pets, setPets] = useState([]);

  async function loadClients() {
    try {
      const res = await api.get("/clients");
      setClients(res.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  async function loadPets() {
    try {
      const res = await api.get("/pets");
      setPets(res.data);
    } catch (error) {
      console.error("Erro ao carregar pets:", error);
    }
  }

  function handleClientDeleted(clientId) {
    setClients(prev => prev.filter(c => c.id !== clientId));
    setPets(prev => prev.filter(p => p.clientId !== clientId));
  }

useEffect(() => {
  const init = async () => {
    await loadClients();
    await loadPets();
  };
  init();
}, []);

  return (
    <div>
      <Clients
        clients={clients}
        setClients={setClients}
        pets={pets}
        setPets={setPets}
        onClientDeleted={handleClientDeleted}
      />
      <hr />
      <Pets
        pets={pets}
        setPets={setPets}
        clients={clients}
      />
    </div>
  );
}

export default App;
