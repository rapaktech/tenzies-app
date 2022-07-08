import './Die.css';

export default function Die (props) {
    const style = {
        backgroundColor: props.isHeld ? '#59E391' : '#FFFFFF'
    }
    return (
        <div className='die' style={style} onClick={props.holdDie}>
            <p className='die--number'>{props.value}</p>
        </div>
    )
}
