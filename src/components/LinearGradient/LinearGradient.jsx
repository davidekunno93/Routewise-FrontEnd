import './lineargradient.scoped.css'
const LinearGradient = ({ topColor, bottomColor, height }) => {
  return (
    <div className="linear-gradient" style={{ height: height ? height+"px" : "100px", background: `linear-gradient(${topColor}, ${bottomColor})` }}></div>
  )
}
export default LinearGradient;