import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ 
    _id,
    title:existingTitle, 
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
    category:assignedCategory,
    properties:assignedProperties,
}) {
    const router = useRouter()
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [category, setCategory] = useState(assignedCategory || '')
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)

    useEffect(() => {
        setCategoriesLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            setCategoriesLoading(false)
        })
    }, [])

    const saveProduct = async (e) => {
        e.preventDefault()
        const data = { title, 
            description, 
            price, 
            images, 
            category, 
            properties:productProperties,
        }
        if (_id) {
            // update
            await axios.put('/api/products/', {...data,_id})
        } else {
            // create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)

    }

    if (goToProducts) {
        router.push('/products')
    }

    const uploadImages = async (e) => {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            setImages(oldImages => {
                return [...oldImages, ...res.data.links]
            })
            setIsUploading(false)
        }
    }

    const updateImagesOrder = (images) => {
        setImages(images)
    }

    const setProductProp = (propName, value) => {
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value
            return newProductProps
        })
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);
        while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
            <form onSubmit={saveProduct}>
                <label>Products name</label>
                <input 
                    type="text" 
                    placeholder="product name" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                />
                <label>Category</label>
                <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                {categoriesLoading && (
                    <Spinner fullWidth={true} /> 
                )}
                {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                    <div key={p.name}>
                        <label>{p.name[0]?.toUpperCase()+p.name.substring(1)}</label>
                        <div>
                            <select 
                                value={productProperties[p.name]}
                                onChange={e => setProductProp(p.name,e.target.value)}
                            >
                                {p.values.map(v => (
                                    <option key={v} value={v}>
                                        {v}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-1 cursor-pointer">
                    <ReactSortable 
                        className="flex flex-wrap gap-1"
                        list={images} 
                        setList={updateImagesOrder}
                    >
                    {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 border border-primary cursor-pointer text-center  flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload
                        <input onChange={uploadImages} type="file" className="hidden"/>
                    </label>
                    {!images?.length && (
                        <div key={images}>No photos in this product</div>
                    )}
                </div>
                <label>Description</label>
                <textarea 
                    placeholder="description" 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
                <label>Price (in USD)</label>
                <input 
                    type="text" 
                    placeholder="price" 
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                />
                <button 
                    className="btn-primary"
                    type="submit"
                >
                    Save
                </button>
            </form>
    )
}