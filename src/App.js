import {useState, useEffect} from 'react';
import {db, auth}  from './firebaseConnection';
import './app.css';
import {doc,
   setDoc,
   collection,
   addDoc,
   getDoc,
   getDocs,
   updateDoc,
   deleteDoc,
   onSnapshot
  } from 'firebase/firestore';

import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth'



function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const[posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');
  const [email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const[user, setUser] = useState(false);
  const[userDetail, setUserDetail] = useState('')
  



  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot)=> {
        let listaPost = [];
        snapshot.forEach((doc)=>{
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPost);
        
      })
      
    }

    loadPosts();


   },[])  

   useEffect(()=>{
    async function checkLogin(){
      onAuthStateChanged(auth,(user)=>{
        if(user){
          console.log(user)
          setUser(true)
          setUserDetail({
            uid: user.id,
            email: user.email
          })
          
        }else{
          setUser(false)
          setUserDetail({})
        }
      })
    }
    checkLogin()


   },[])
  
  async function handleAdd(){
    await addDoc(collection(db, "posts"),{
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{
      console.log("Cadastrado com sucesso!")
      setTitulo('');
      setAutor('');
    })
    .catch((error)=>{
      console.log("Erro ao cadastrar" + error)
    })
  }

  async function buscarPost(){
    const postRef = collection(db, "posts");
    await getDocs(postRef)
    .then((snapshot)=>{
      let lista = [];
      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        })
      })
      setPosts(lista);

    })
    .catch((error)=>{
      console("Deu algum erro ao buscar")
    })

  }

  async function editarPost(){
    const docRef= doc(db, "posts", idPost)
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log("Post atualizado")
      setIdPost('')
      setTitulo('')
      setAutor('')
    })
    .catch(()=>{
      console.log("Erro ao atualizar post")
    })
  }

  async function excluirPost(id){
    const docRef = doc(db, "posts", id)
    await deleteDoc(docRef)
    .then(()=>{
      alert("Post deletado com sucesso.")
    })
    .catch(()=>{
      alert("Não foi possível deletar")
    })

  }

  async function novoUsuario(){
    await createUserWithEmailAndPassword(auth, email, senha)
    .then(()=>{
      console.log("Cadastrado com sucesso")
      setEmail('')
      setSenha('')

    })
    .catch((error)=>{
      console.log("Erro ao cadastrar")
      if(error.code === 'auth/weak-password'){
        alert("Senha fraca")
      }else if(error.code === 'auth/email-already-in-use'){
        alert("Email ja cadastrado")
      }
    })
  }
  
  async function logarUsuario(){
    await signInWithEmailAndPassword(auth, email, senha)
    .then((value)=>{
      console.log("Logado com sucesso")
      console.log(value.user)

      setUserDetail({
        uid: value.user.uid,
        email: value.user.email
      })
      setUser(true);

      setEmail('')
      setSenha('')
    })
    .catch(()=>{
      console.log("error ao fazer login")
    })

  }

  async function fazerLogout(){
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div className="App">
      <h1>ReactJS + Firebase</h1>
      {user && (
        <div>
          <strong>Seja bem vindo(a) - Você está logado!</strong><br/>
          <span>ID: {userDetail.uid} <br/>  Email: {userDetail.email} </span><br/>
          <button onClick={fazerLogout}>Sair da conta</button>
        </div>
      )}

      <div className="container">
        <h2>Usuarios</h2>
        <label>Email</label>
        <input
        value={email}
        onChange={(e)=> setEmail(e.target.value)}
        placeholder='Digite um email'
        /><br/>

        <label>Senha</label>
        <input
        value={senha}
        onChange={(e)=> setSenha(e.target.value)}
        placeholder='Digite sua senha'
        /><br/>

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer login</button>


      </div>
      <br/><br/>
      <hr/>

      <div className="container">
        <h2>Posts</h2>
        <label>ID do Post:</label>
        <input
          placeholder='Digite o ID do Post'
          value={idPost}
          onChange={(e)=> setIdPost(e.target.value)}
        
        /><br/>

        <label>Titulo:</label>
        <textarea 
          type="text"
          placeholder="Digite o titulo"
          value={titulo}
          onChange={ (e) => setTitulo(e.target.value) }
        />

        <label>Autor:</label>
        <input
        type="text"
        placeholder="Autor do post"
        value={autor}
        onChange={(e) => setAutor(e.target.value) }
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button> <br/>
        <button onClick={editarPost}>Atualizar post</button>

        <ul>
          {posts.map((post)=>{
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Titulo: {post.titulo} </span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={()=> excluirPost(post.id)}>Excluir</button><br/> <br/>
              </li>

            )
          })}
        </ul>

      </div>
    </div>
  );
}

export default App;
