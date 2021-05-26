import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import { render } from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App: React.FC = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: './esbuild.wasm',
    });
  };

  const onButtonClick = async () => {
    if (!ref.current) return;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
      define: {
        'process.env.NODE_ENV': `"production"`,
        global: 'window',
      },
    });

    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          setInput(event.target.value)
        }
      />
      <div>
        <button onClick={onButtonClick}>Submit</button>
      </div>
      <div>
        <pre>{code}</pre>
      </div>
    </div>
  );
};

render(<App />, document.getElementById('root'));
