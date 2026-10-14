import { Component, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './context';
import { App } from './App';
import '../styles/main.css';
class Boundary extends Component<{children:ReactNode},{error:string}>{state={error:''};static getDerivedStateFromError(error:Error){return {error:error.message};}render(){return this.state.error?<main className="loading"><h1>Encontramos un problema de interfaz.</h1><p>{this.state.error}</p><p>Tus datos locales se conservan.</p><button onClick={()=>location.reload()}>Volver a cargar</button></main>:this.props.children;}}
createRoot(document.getElementById('root')!).render(<Boundary><Provider><App/></Provider></Boundary>);
