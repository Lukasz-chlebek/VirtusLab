import "./Pokemone.css"
import axios from "axios";
import {useEffect, useState} from "react";
import logo from "./logo.png"
import {colors_text, colors} from "./Colors"
import useLocalStorage from 'use-local-storage'
import moon from "./moon.svg"
import sun from "./sun.svg"
import loader from "./loader.png"


function Pokemone(){
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
    const [posts, setposts] = useState([])
    const [isLoading, setLoading] = useState(true)
    let [rate, setRate] = useState(1)
    let [i, setI] = useState(1)
    const [sortType, setSortType] = useState(true)
    const [sortType2, setSortType2] = useState(true)

    const switchTheme = () =>{
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
    }

    useEffect(()=>{
            for( i ; i<21*rate; i++){
                axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
                    .then(res=>{
                        setposts((old => [...old,res.data]))
                        setLoading(false)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }

        }
        ,[i, rate])

    useEffect(() => {
        const sortArray = name => {
            const sorted = [...posts].sort((a, b) => a.name.localeCompare(b.name));
            setposts(sorted)
            setSortType(false)
            setSortType2(false)
        };
        sortArray(sortType);
    }, [sortType]);

    useEffect(() => {
        const sortArray = type => {

            const sorted2 = [...posts].sort((a, b) => a.types.at(0).type.name.localeCompare(b.types.at(0).type.name));
            setposts(sorted2);
            setSortType2(false)
            setSortType(true)
        };
        sortArray(sortType2);
    }, [sortType2]);
    if(isLoading){
        return(
            <div className={"loader"}>
                <img src={loader} alt={"Loader"} className={"loader--img"} />
                <p className={"loader--text"}>Loading...</p>
            </div>
        )
    }
    const poke = posts.map(poke =>{

        return(

                <div key={poke.id} className={"container"}>
                    <p className={"poke--name"} key={poke.id}>{poke.name}</p>
                    <div className={"types"}>
                    {poke.types.map( types=>{
                        return<p style={{backgroundColor: colors[types.type.name], color:colors_text[types.type.name]}} className={"poke--type"} key={types.id}>{types.type.name}</p>
                    })}
                    </div>
                    <div className={"other--detail"} >
                        <p>Weight {poke.weight}</p>
                        <p>Height {poke.height}</p>
                    </div>
                    <img  className={"sprites"} key={poke.id} src={poke.sprites.front_default} alt={""} />
                </div>
        )
    })
    let but
    if(theme ==="dark"){
       but = <img src={sun} alt={""} />
    }else{
       but= <img src={moon} alt={""} />
    }
    return(
        <body color-scheme={theme}>
        <div className={"big--container"} >
            <button className={"buttonTheme"} onClick={switchTheme}>
                {but}
            </button>
            <img className={"logo"} src={logo} alt={"logo"}/>
            <p className={"filter"}>Filter by</p>
            <div className={"inputs"}>
                <div>
                    <input  type="radio" id="name" name="filter" value="name"
                            onChange={(e) => setSortType(e.target.value)}  />
                    <label className={"radio--label"} htmlFor="name">Name</label>
                </div>
                <div>
                    <input  type="radio" id="type" name="filter" value="type"
                            onChange={(e) => setSortType2(e.target.value)} />
                    <label className={"radio--label"} htmlFor="type">Type</label>
                </div>
            </div>
            <p className={"info"}>Hover over tile to see more information</p>
            {poke}
            <div className={"buttons"}>
                <button onClick={()=>{
                    setLoading(true);
                    setRate(rate+1);
                    setI(i+21);
                    setLoading(false);
                }} className={"view--more"}>View more</button>
                <button onClick={()=>window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                })}>Scroll up</button>
            </div>
        </div>
        </body>
    )
}

export default Pokemone;
