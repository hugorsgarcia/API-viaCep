import {useState } from "react";
import './index.css'
import './theme.css'

function App (){

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [street, setStreet] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [cepError, setCepError] = useState('')
  const [isCepValid, setIsCepValid] = useState(true)
  const [generalErrorMessage, setGeneralErrorMessage] = useState("")
  const [addressList, setAddressList] = useState([]);
  const [emailError, setEmailError] = useState('');
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  function handleChange(event){
    event.preventDefault();
    setGeneralErrorMessage('');
    
  }

  const validateCep = (cep) => {
    if(cep.length !== 8){
        setCepError('CEP deve ter 8 dígitos')
        setIsCepValid(false)
        setGeneralErrorMessage('');
        return false
    }
    else 
      setIsCepValid(true)
      setCepError('')
      return true

  }

  const validateEmail = (email) => {
    if (emailRegex.test(email)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Email inválido');
      return false;
    }
  };

  async function handleSubmit(event){
    event.preventDefault();
    if (!validateCep(cep)) {
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if(response.ok && !data.erro){
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
        setGeneralErrorMessage('');
      }

      else {
        setGeneralErrorMessage('CEP inválido');
        setStreet('');
        setNeighborhood('');
        setCity('');
        setState('');
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      setGeneralErrorMessage('Erro ao buscar o CEP');
      }
    }

    const handleRegister = (event) => {
      event.preventDefault();
      // adicionar ao array de enredereços
      if (isCepValid && street && neighborhood && city && state && name && email ) {
            const newAddress = { name, cep };
            setAddressList([...addressList, newAddress]);
            alert("Cadastro realizado com sucesso!");
            
            setName('');
            setEmail('');
            setCep('');
            setStreet('');
            setNeighborhood('');
            setCity('');
            setState('');
            setGeneralErrorMessage("");
  
      } else if (!isCepValid) {
            setGeneralErrorMessage('CEP inválido');
  
      } else {
            setGeneralErrorMessage('Preencha todos os campos.');
  
      }
    };

    function toggleTheme() {
      document.body.classList.toggle('light-mode');
      const isDarkMode = !document.body.classList.contains('light-mode');
      localStorage.setItem('darkMode', isDarkMode);
    }
    
    window.addEventListener('load', () => {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      if (!isDarkMode) {
        document.body.classList.add('light-mode');
      }
    });

    return (
      <div>
        <button id="theme-toggle" onClick={toggleTheme}>🌓</button>
        <h1>Cadastro de Usuario</h1>
        <label htmlFor="name" onChange={handleChange}>Nome: </label>  
        <input required type="text" id="name" value={name} onChange={(e) => {setName(e.target.value);handleChange(e)}} />
  
        <label htmlFor="email" onChange={handleChange}>Email: </label>
        <input required type="text" id="email" value={email} onChange={(e) => {setEmail(e.target.value);validateEmail(e.target.value);handleChange(e)}}/>
        {emailError && <div className="error">{emailError}</div>}

        <label htmlFor="cep" onChange={handleChange}>CEP: </label>
        <input required type="number" id="cep" value={cep} onBlur={handleSubmit} onChange={(e) => {setCep(e.target.value); handleChange(e)}}/>
        

        <label htmlFor="street" onChange={handleChange}>Rua:</label>
        <input required type="text" id="street" value={street} onChange={(e) => {setStreet(e.target.value);handleChange(e)}}/>
  
        <label htmlFor="neighborhood" onChange={handleChange}>Bairro:</label>
        <input required type="text" id="neighborhood" value={neighborhood} onChange={(e) => {setNeighborhood(e.target.value);handleChange(e)}} />
  
        <label htmlFor="city" onChange={handleChange}>Cidade:</label>
        <input required type="text" id="city" value={city} onChange={(e) => {setCity(e.target.value);handleChange(e)}} />
  
        <label htmlFor="state" onChange={handleChange}>Estado:</label>
        <input required type="text" id="state" value={state} onChange={(e) => {setState(e.target.value);handleChange(e)}} />
        <button onClick={handleRegister}>Cadastrar</button>
        {cepError && <div className="error">{cepError}</div>}
        {generalErrorMessage && <div className="error">{generalErrorMessage}</div>}

        {addressList.length > 0 && (
                <div>
                    <h2>Endereços Cadastrados:</h2>
                    <ul>
                        {addressList.map((address, index) => (
                            <li key={index}>
                                Olá me chamo {address.name}, e atualmente estou residindo no cep {address.cep}
                            </li>
                        ))}
                    </ul>
                </div>
      )}
      </div>
    )

  }

export default App
