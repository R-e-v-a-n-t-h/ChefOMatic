class Env{
    constructor(url, dishesPerPage){
        this.url =url,
        this.dishesPerPage = dishesPerPage
    }
}

const env = new Env(
    url="https://7729-2-51-66-185.ngrok-free.app",
    dishesPerPage=200
    )

export default env