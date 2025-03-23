# StockEquipmentManagement

Ce composant est responsable de la gestion des équipements de stock. Il récupère les données de stock depuis le backend et les affiche dans un tableau. Il inclut également un filtre pour filtrer le stock par statut.

## Composants

- **StockEquipmentManagement**: Le composant principal qui récupère et affiche les équipements de stock.
- **StatusFilter**: Un sous-composant utilisé pour filtrer les équipements de stock par statut.

## Utilisation

```tsx
import StockEquipmentManagement from './StockEquipmentManagement';

function App() {
  return (
    <div className="App">
      <StockEquipmentManagement />
    </div>
  );
}

export default App;
```
