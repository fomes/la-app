"use client";

import { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getProductById } from "@/services/getProductById";
import { ModalDelete } from "../modal-delete";
import { Product } from "@/types";

const inputClass =
  "block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-slate-500 focus:outline-none focus:ring-0 focus:border-slate-600 peer";
const labelClass =
  "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-[0.6rem] z-10 origin-[0] start-2.5 peer-focus:text-slate-600 peer-focus:dark:text-slate-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto";

export interface EditProductProps {
  id: string;
}

const EditProduct = ({ id }: EditProductProps) => {
  const initialState = {
    name: "",
    brand: "",
    urlImage: "",
    price: 0,
    stock: 0,
  };

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>({});
  const [error, setError] = useState("");

  const router = useRouter();

  const token =
    typeof window !== "undefined" &&
    window.localStorage.getItem("la-api-token");

  function checkValues(currentState: any, initialState: any) {
    return Object.keys(currentState).every(
      (chave) => currentState[chave] !== initialState[chave]
    );
  }

  const onSubmit = async (event: any) => {
    event.preventDefault();

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (checkValues(data, initialState)) {
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`,
          data,
          config
        );

        toast(response.data.message);
        setData(initialState);
      } catch (err: any) {
        toast(err.response.data.message);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast("Fill in all the fields");
    }
  };

  const handleChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    getProductById(id, setIsLoading, setData, setError);
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    <div>
      <Spinner />{" "}
    </div>;
  }

  return (
    <>
      <Navbar />
      <div className="h-screen -mt-16">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 justify-center items-center h-screen"
        >
          <div className="flex w-60 relative">
            <h1 className="text-2xl font-bold ml-1">Edit Product</h1>

            <ModalDelete id={id} />
          </div>

          <div className="flex flex-col gap-2 w-60">
            <div className="relative">
              <Input
                type="text"
                id="name"
                name="name"
                placeholder=""
                value={data?.name || ""}
                onChange={(e) => handleChange(e)}
                className={inputClass}
              />
              <Label htmlFor="name" className={labelClass}>
                Name
              </Label>
            </div>

            <div className="relative">
              <Input
                type="text"
                name="brand"
                placeholder=""
                value={data?.brand || ""}
                onChange={(e) => handleChange(e)}
                className={inputClass}
              />
              <Label htmlFor="brand" className={labelClass}>
                Brand
              </Label>
            </div>

            <div className="relative">
              <Input
                type="text"
                name="urlImage"
                placeholder=""
                value={data?.urlImage || ""}
                onChange={(e) => handleChange(e)}
                className={inputClass}
              />
              <Label htmlFor="urlImage" className={labelClass}>
                Image(URL)
              </Label>
            </div>

            <div className="relative">
              <Input
                type="number"
                name="price"
                placeholder=""
                value={data?.price || 0}
                onChange={(e) => handleChange(e)}
                className={inputClass}
              />
              <Label htmlFor="price" className={labelClass}>
                Price
              </Label>
            </div>

            <div className="relative">
              <Input
                type="number"
                name="stock"
                placeholder=""
                value={data?.stock || 0}
                onChange={(e) => handleChange(e)}
                className={inputClass}
              />
              <Label htmlFor="stock" className={labelClass}>
                Qty
              </Label>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : <span>Save</span>}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;