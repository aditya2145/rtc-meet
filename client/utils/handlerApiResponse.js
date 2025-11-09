export const handleApiResponse = async(res) => {
    const data = await res.json();
    if(!res.ok) {
        throw new Error(data.message || "Something went wrong");
    } 
    return data;
}