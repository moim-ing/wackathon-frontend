import { useState } from 'react';

export default function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Hello Dashboard!</p>
      <button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </button>
    </div>
  );
}
