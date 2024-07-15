import axios from "axios";

const token =
  typeof window !== "undefined" && window.localStorage.getItem("la-api-token");

export const deleteProductById = async (
  id: string,
  setIsLoading: (value: boolean) => void,
  setError: (value: string) => void
) => {
  setIsLoading(true);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`,
      config
    );
  } catch (e: any) {
    if (e.name === "AbortError") {
      console.log("Aborted");
      return;
    }

    setError(e);
  } finally {
    setIsLoading(false);
  }
};