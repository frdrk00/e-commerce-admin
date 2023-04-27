import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({ 
    _id,
    title:existingTitle, 
    description:existingDescription,
    price:existingPrice,
    images:existingImages,
}) {
    const router = useRouter()
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const saveProduct = async (e) => {
        e.preventDefault()
        const data = { title, description, price, images }
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

    return (
            <form onSubmit={saveProduct}>
                <label>Products name</label>
                <input 
                    type="text" 
                    placeholder="product name" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                />
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-1 cursor-pointer">
                    <ReactSortable 
                        className="flex flex-wrap gap-1"
                        list={images} 
                        setList={updateImagesOrder}
                    >
                    {!!images?.length && images.map(link => (
                        <div key={link}>
                            <Image //prerobiť na img(inak nefunguje react sortable)
                                src={link}
                                width={100}
                                height={100}
                                alt=""
                                className="h-24 rounded-lg"
                            />
                        </div>
                    ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 border cursor-pointer text-center  flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-100">
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