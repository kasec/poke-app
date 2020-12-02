import { useState } from 'react'

const InputComponent = ({label, value, onChange}) => (
  <div>
    <label style={{marginRight: "10px"}}>{label}</label>
    <input value={value} onChange={onChange}></input>
  </div>
)

import styles from '../styles/Home.module.css'

const cardStyle = { border: "1px solid grey", borderRadius: "8px", paddingTop: "10px", marginTop: "5px" }

const GET_POKE_ENDPOINT = 'http://localhost:8081/api/v1/pokemon'
export default function Home() {
  const [pokemons, setPokemons] = useState([])
  
  const [singlePokemon, setPokemonName] = useState("")
  const [myList, setMyList] = useState([])

  const changeListener = ev => setPokemonName(ev.target.value)

  const catchPokemonAction = (singlePokemon) => async () => {
      if(!singlePokemon) {
        alert("Fill the input field to search")
        return
      }

      const resolvedData = await fetch(`${GET_POKE_ENDPOINT}/${singlePokemon}`).then(res => res.json())
      
      if(resolvedData.message) {
        alert(resolvedData.message)
      } else if(resolvedData.data) {
        console.log("resolvedData", resolvedData.data);
        setMyList([
          ...myList, 
          { 
            id: resolvedData?.data?.id,
            name: resolvedData?.data?.name,
            pic: resolvedData?.data?.image
          }
        ])
      }
  }


  useState(() => {
    fetch("https://pokeapi.co/api/v2/pokemon")
      .then(res => res.json())
      .then((response) => {
        setPokemons(response.results)
      })
  }, [])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my <span className={styles.mark}> Poke App </span>
        </h1>

        <p className={styles.description}>
          <InputComponent label={"Catch Pokemon"} value={singlePokemon} onChange={changeListener}/>
          <button onClick={catchPokemonAction(singlePokemon)}>Catch</button>
        </p>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h1>My Pokemons</h1>
            {
              myList.map(item => (
                <div style={cardStyle}>
                  <span><b>ID:</b>{"  " + item.id + "  " } <b>Name:</b> {"   " + item.name}</span>
                  <img src={item.pic}/>
                </div>
              ))
            }
          </section>
          <section className={styles.card}>
            <h1>Pokemons List</h1>
            {pokemons.map(item => (
                  <p>
                    { item.name }
                  </p>
            ))}
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
          <span>Powered by <b> Gelacio Azael</b></span>
      </footer>
    </div>
  )
}