import { Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import Rating from './Rating.js'
import { Store } from '../Store.js';
import { useContext } from 'react';
import axios from 'axios';
export default function Product(props){
    const {product} = props;
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {
        cart: {cartItems},
    } = state;

    const addToCartHandler = async (item)=>{
        const existItem = cartItems.find(cartItem => cartItem._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;

        const {data} = await axios.get(`/api/products/${item._id}`)

        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        ctxDispatch({ 
            type: 'CART_ADD_ITEM', 
            payload:{...item, quantity} 
        });
    }
    
    return(
    <Card>
        <Link to={`/product/${product.slug}`}>
            <img src={product.image} alt={product.name} className="card-img-top"/>
        </Link>
        <Card.Body>
            <Link to={`/product/${product.slug}`}>
                <Card.Title>{product.name}</Card.Title>
            </Link>
            <Rating rating={product.rating} numReviews={product.numReviews}/>
            <Card.Text>
                ${product.price}
            </Card.Text>
            {product.countInStock ===0 ?
            (<Button variant="light" disabled>Out in stock</Button>)
            :(<Button onClick={()=>addToCartHandler(product)}>Add to Cart</Button>)
            }
        </Card.Body>
    </Card>)
}