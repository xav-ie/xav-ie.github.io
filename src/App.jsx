import './App.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import 'flexboxgrid';

const App = ()=>{
    return (
	<div className="App">
	    <Header/>
	    <Main/>
	    <Footer/>
	</div>
    );
}

export default App;
