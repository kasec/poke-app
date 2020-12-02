const express = require("express")
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();
const app = express();

const port = 8081;

app.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.headers.origin); //req.headers.origin
    res.set('Access-Control-Allow-Credentials', 'true');
    // access-control-expose-headers allows JS in the browser to see headers other than the default 7
    res.set(
        'Access-Control-Expose-Headers',
        'date, etag, access-control-allow-origin, access-control-allow-credentials',
    );
    // set methods Access-Control-Allow-Methods
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const resolvePokemonWithName = async (name) => {
    let isSuccess, isFailure, value, message

    try {
        value = await P.getPokemonByName(name) // with Promise
        isSuccess = true
    } catch(err) {
        isFailure = true
        message = "Pokemon name does not match"    
    }

    return { value, isFailure, isSuccess, message }
}

const mapValue = (value) => {
    if(!value) throw "mapValue FUNCTION :: REQUIRE A <POKEMON OBJECT> PARAMETER"
    return {
        id: value.id,
        name: value.name,
        image: value?.sprites?.front_shiny 
    }
}

app.get("/api/v1/pokemon/:name", async (req, res) => {
    try {
        const { name } = req.params
        const { isFailure, isSuccess, value, message } = await resolvePokemonWithName(name)

        if(isFailure) return res.status(404).json({ message })

        if(isSuccess) return res.status(200).json({ data: mapValue(value) })

        throw { isFailure, isSuccess, value, message }

    } catch(err) {
        console.info("err => ", err);
        res.status(500).json({
           message: "Server error" ,
           err
        })
    }

})

app.listen(port, function () {
    console.log('HTTP its running at -> ', port);
});
