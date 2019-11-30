import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import './home.scss';

class App extends React.Component {
	render( ) {
		return (
			<div>
                <p>Hello!</p>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('container'));