class Env{
    constructor(url, dishesPerPage){
        this.url =url,
        this.dishesPerPage = dishesPerPage
    }
}

const env = new Env(
    url="http://10.0.2.2:8000",
    dishesPerPage=25
    )

export default env