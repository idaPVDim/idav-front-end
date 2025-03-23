# Components

Ce dossier contient tous les composants réutilisables utilisés dans le projet. Chaque composant doit avoir son propre dossier contenant le fichier du composant, les styles associés et un fichier README décrivant le composant.

## Structure

- **StockEquipmentManagement**: Gère les équipements de stock.
  - `StockEquipmentManagement.tsx`: Le fichier principal du composant.
  - `StatusFilter.tsx`: Un sous-composant pour filtrer les équipements de stock par statut.
  - `StockEquipmentManagement.css`: Styles pour le composant.
  - `README.md`: Documentation pour le composant.

## Utilisation

Pour utiliser un composant, importez-le dans votre fichier et incluez-le dans votre JSX.

```tsx
import ComponentName from './ComponentName';

function App() {
  return (
    <div className="App">
      <ComponentName />
    </div>
  );
}

export default App;
```
