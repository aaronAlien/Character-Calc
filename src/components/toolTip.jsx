import { useState } from 'react';

export default function Tooltip({ title, children, offset = 8 }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function show(e) {
    setVisible(true);
    move(e);
  }

  function move(e) {
    setPos({
      x: e.pageX + offset,
      y: e.pageY + offset,
    });
  }

  function hide() {
    setVisible(false);
  }

  return (
    <>
      <span
        className="inline-block"
        onMouseEnter={show}
        onMouseMove={move}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
      >
        {children}
      </span>

      {visible && (
        <div
          className="absolute z-50 pl-4 pr-2 py-1 rounded-xl bg-zinc-300 border border-zinc-700
                     text-sm text-zinc-900 pointer-events-none"
          style={{
            top: pos.y,
            left: pos.x,
          }}
        >
          {title}
        </div>
      )}
    </>
  );
}
