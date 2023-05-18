class Env{
    constructor(url, robourl,dishesPerPage){
        this.url =url,
        this.robourl=robourl,
        this.dishesPerPage = dishesPerPage
    }
}

const env = new Env(
    url="http://10.0.2.2:8000",
    robourl="http://10.0.2.2:8080",
    dishesPerPage=25
    )

export default env