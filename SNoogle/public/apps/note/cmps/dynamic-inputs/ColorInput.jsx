export function ColorInput({ onSetColorStyle, backgroundColor }) {
  const colors = [
    '#F28B82', '#FBBC04', '#FFF475', '#CCFF90', '#A7FFEB',
    '#CBF0F8', '#AECBFA', '#D7AEFB', '#FDCFE8', '#E6C9A8',
    '#E8EAED'
  ]

  function onSetColor(color) {
    const newStyle = {
      backgroundColor: color || null
    }
    onSetColorStyle(newStyle)
  }

  return (
    <section className="color-input">
      <div className="items-container">
        <div
          className={`item no-color ${!backgroundColor ? 'chosen' : ''}`}
          title="No color"
          onClick={() => onSetColor(null)}
        >
          🈳
        </div>
        {colors.map(color => (
          <div
            key={color}
            className={`item ${color === backgroundColor ? 'chosen' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSetColor(color)}
          />
        ))}
      </div>
    </section>
  )
}
