import MonacoEditor from 'react-monaco-editor';

function App() {
  return (
    <div className="App">
      
      <MonacoEditor
        width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        value={'code'}
        onChange={() => {}}
      />
    </div>
  );
}

export default App;
