import './loading.scoped.css'
import { Loading } from "./Loading";

const LoadingFillElement = ({ innerText, noMascot, noText, color }) => {
    return (
        <div
            className="loading-fillElement"
            data-color={color}
        >
            <Loading
                innerText={innerText}
                noMascot={noMascot}
                noText={noText}
            />
        </div>
    )
}
export default LoadingFillElement;