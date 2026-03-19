export default function Port({ port }) {
  return (
    <div className="port">
      <span className="port-icon">!</span>
      <span className="port-title">{port.title}</span>
      {port.deadline && <span className="port-deadline">{port.deadline}</span>}
      {port.content && <p className="port-content">{port.content}</p>}
    </div>
  )
}
