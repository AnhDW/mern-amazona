import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
import {Link, useNavigate, useLocation } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify'
import { Helmet } from "react-helmet-async";
import {Row, Col} from "react-bootstrap";
import Rating from "../components/Rating";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true}
        case 'FETCH_SUCCESS':
            return { ...state,
                products: action.payload.products,
                page: action.payload.page,
                pages: action.payload.pages,
                countProducts: action.payload.countProducts,
                loading: false
            }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload}
        default:
            return state
    }
}

const prices = [
    {
        name:'$1 to $50',
        value: '1-50'
    },
    {
        name:'$51 to $200',
        value: '51-200'
    },
    {
        name:'$201 to $1000',
        value: '201-1000'
    },
]

export const ratings = [
    {
        name: '4start & up',
        rating: 4,
    },
    {
        name: '3start & up',
        rating: 3,
    },
    {
        name: '2start & up',
        rating: 2,
    },
    {
        name: '1start & up',
        rating: 1,
    },
] 

export default function SearchScreen () {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const category = sp.get('category'||'all');
    const query = sp.get('query'||'all');
    const price = sp.get('price'||'all');
    const rating = sp.get('rating'||'all');
    const order = sp.get('order'||'newest');
    const page = sp.get('page'||'1');

    const [{ loading, error, product, pages, countProducts }, dispatch] = useReducer(reducer,{
        loading: true,
        error: ''
    })

    useEffect(()=>{
        const fetchData = async () => {
            try{
                // const { data } = await axios.get(`/api/products/search?page${page}&query=${query}&catelogy=${category}&price=${price}&rating=${rating}&order=${order}`);
                // dispatch({ type: 'FETCH_SUCCESS', payload: data });
            }catch(err){
                dispatch({ type: 'FETCH_FAIL', payload:getError(err)});
            }
        }
        fetchData();
    },[category, error, order, page, price, query, rating])

    const [categories, setCategories] = useState([])
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // const {data} = await axios.get(`/api/products/categories`);
                // setCategories(data);
            }catch (err) {
                toast.error(getError(err))
            }
        }
        fetchCategories();
    },[dispatch])

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = filter.category || category;
        const filterQuery = filter.query || query;
        const filterRating = filter.rating || rating;
        const filterPrice = filter.price || price;
        const sortOrder = filter.order || order;
        return `/search?category=${filterCategory}&query=${filterQuery}&rating=${filterRating}&price=${filterPrice}&order=${sortOrder}&page=${filterPage}`
    }

    return(
        <div>
            <Helmet><title>Search Products</title></Helmet>
            <Row>
                <Col md={3}>
                    <div>
                        <h3>Departments</h3>
                        <ul>
                            <li>
                                <Link className={'all' === category ? 'text-bold':''} 
                                    to={getFilterUrl({category: 'all'})}
                                >Any
                                </Link>
                            </li>
                            {categories.map( c => (
                                    <li key={c}>
                                        <Link 
                                            className={c === category ? 'text-bold':''} 
                                            to={getFilterUrl({category:c})}
                                        >
                                            {c}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Price</h3>
                        <ul>
                            <li>
                                <Link className={'all' === price ? 'text-bold':''} 
                                    to={getFilterUrl({price: 'all'})}
                                >Any
                                </Link>
                            </li>
                            {prices.map( p => (
                                    <li key={p.value}>
                                        <Link 
                                            className={p.value === price ? 'text-bold':''} 
                                            to={getFilterUrl({price:p.value})}
                                        >
                                            {p.name}
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Avg. Customer Review</h3>
                        <ul>
                            {ratings.map( r => (
                                    <li key={r.name}>
                                        <Link 
                                            className={`${r.rating}` === `${rating}` ? 'text-bold':''} 
                                            to={getFilterUrl({rating:r.rating})}
                                        >
                                            <Rating caption={' & up'} rating={r.rating}></Rating>
                                        </Link>
                                    </li>
                                ))}
                            <li>
                                <Link 
                                    to={getFilterUrl({rating: 'all'})}
                                    className={rating === 'all' ? 'text-bold':''}
                                >
                                    <Rating caption={' & up'} rating={0}></Rating>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Col>
                <Col md={9}>
                    {loading ? (<LoadingBox />
                    ):error ? (<MessageBox variant="danger">{error}</MessageBox>
                    ):(
                       <></> 
                    )}
                </Col>
            </Row>
        </div>
    ) 
}