import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello World!</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </div>
  );
}
