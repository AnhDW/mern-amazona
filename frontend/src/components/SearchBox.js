import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SearchBox () {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `search/?query=${query}` : '/search')
    }
    return(
        <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
                <Form.Control 
                    type="text" 
                    name="q" 
                    id="q" 
                    onChange={e => setQuery(e.target.value)} 
                    placeholder="Search products..."
                    aria-label="Search products..."
                    aria-describedby="button-search"
                ></Form.Control>
                <Button 
                    variant="outline-primary" type="submit" id="button-search"
                >
                    <i class="fa fa-search"></i>
                </Button>
            </InputGroup>
        </Form>
    )
}