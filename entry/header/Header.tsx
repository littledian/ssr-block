import React, { useState } from 'react';
import { Button } from 'antd';

export default function Header() {
  const [count, setCount] = useState(0);
  return (
    <div>
      {count}
      <Button onClick={() => setCount((prev) => prev + 1)}>点我</Button>
    </div>
  );
}
