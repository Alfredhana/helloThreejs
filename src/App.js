import logo from './logo.svg';
import './App.css';

import ThreeTest from './pages/threeTest';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <canvas id="bg"></canvas>
        <ThreeTest></ThreeTest>
      </header>
    </div>
  );
}

export default App;
