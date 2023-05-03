import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
    const router = useRouter()
    const { id } = router.query
    const [productInfo, setProductInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        if (!id) {
            return 
        }
        axios.get(`/api/products?id=${id}`).then(response => {
            setProductInfo(response.data);
            setIsLoading(false)
        })
    }, [])

    return (
        <Layout>
            <h1>Edit product</h1>
            {isLoading && (
                <Spinner fullWidth={true} />
            )}
            {productInfo && (
                <ProductForm {...productInfo} />
            )}
        </Layout>
    )
}