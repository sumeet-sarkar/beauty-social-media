import './App.css';
import Calendar from './containers/Calendar';

function App() {
	return (
		<div className="App">
			<Calendar />
		</div>
	);
}

export default App;


/*

till 600
if more than 3 legends, show 2 and ...

till 1080
if more than 4 legends, show 3 and ...

more than 1080, 
show all legends

getLegendsElement and getRatingsElement used in days.js and carousal.js is duplicate

in days, instead of using ifs, can store dates in an array according to required logic 

instead of using different arrays for posts, carousal posts and total posts, can use indexing on totalposts

*/