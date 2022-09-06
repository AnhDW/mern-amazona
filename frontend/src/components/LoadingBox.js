import { Spinner } from "react-bootstrap";

export default function LoadingBox (){
    return (
        <div>
            <Spinner animation="grow" role="status" variant="warning">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}