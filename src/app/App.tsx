
import {timeline} from "../entities/Timeline/data";
import DateEventWheel from "../widgets/DateEventWheel/DateEventWheel";



const App = () => {

    return (
        <div>
            <DateEventWheel timeline={timeline}/>
            <DateEventWheel timeline={timeline}/>
        </div>
    )};


export default App;