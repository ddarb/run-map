const API_ENDPOINT = process.env.REACT_APP_API_URI

export async function getRoute(from, to) {
    console.log(from, to)
    const response = await fetch(`${API_ENDPOINT}/api/v1/route/calc/?from=${from[0]},${from[1]}&to=${to[0]},${to[1]}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    return await response.json();
}