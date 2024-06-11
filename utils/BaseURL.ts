let BASE_URL: string;

if (process.env.NODE_ENV == "production") {
    BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string
}

else {
    BASE_URL = "http://localhost:5000/api"
}

export default BASE_URL