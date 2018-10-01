import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import players from './players_2019';

class Team extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedElem: null
        }
    }

    handleClick(i, elem) {
        /*this.setState({focusedElem: document.getElementById(elem)});
        console.log(this.state.focusedElem);
        document.getElementById(elem).style.opacity = '1';*/

        const playerList = this.props.data.players.filter((player) => player.tid === i);
        ReactDOM.render(
            <PlayerList list={playerList} />,
                document.getElementById('player-container')   // как лучше для производительности: show/hide или так??
            );
    };

    handleButton() {
        const freeAgentsList = this.props.data.players.filter((player, i) => player.tid === -1);
        ReactDOM.render(
            <PlayerList list={freeAgentsList} />,
                document.getElementById('player-container')   
            );    
    };

    handleRightClick(e, i) {
        e.preventDefault();
        document.getElementById('hint').style.display = 'block';

        const coords = {
            'x': e.clientX,
            'y': e.clientY
        };

        const hint = document.getElementById('hint');
        
        if(hint.offsetHeight > document.documentElement.clientHeight - coords.y) { 
            hint.style.top = coords.y - hint.offsetHeight + document.documentElement.scrollTop + 'px';
            hint.style.left = coords.x + 'px';
        } else {
            hint.style.top = coords.y + document.documentElement.scrollTop + 'px';
            hint.style.left = coords.x + 'px';
        }
    
        ReactDOM.render(
            <Hint data={players.teams[i]} />,
                    document.getElementById('hint')
                    );
    }
    render() {
        const teamList = this.props.data.teams.map((team, i) =>
            <li key={team.abbrev}>
                <img 
                    src={team.imgURL} 
                    alt={team.region + ' ' + team.name} 
                    className='team-logo'
                    id={team.abbrev}
                    onClick={() => this.handleClick(i, team.abbrev)}
                    onContextMenu={(e) => this.handleRightClick(e, i)}
                >
                </img>
            </li>
            )

        return(
            <div>
                <div className='box-header'>Teams <button className='FAbutton' onClick={() => this.handleButton()}>Show Free Agents</button><br/><div className='optional'>(<b>right click</b> on logo for team info, <b>left click</b> for team roster)</div></div>
                <ul className='team-list'>
                    {teamList}
                </ul>
            </div>    
        )
    }
}

class PlayerList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(i) {
        const player = this.props.list[i];
        ReactDOM.render(
            <Player data={player} />,
            document.getElementById('player-info-container')
            ); 
    }

    render() {
        const playerList = this.props.list.map((player, i) =>
            <li 
                key={player.name + ' ' + player.born.year} 
                className='player-from-list'
                onClick={() => this.handleClick(i)}
            >
                {(player.name || player.firstName + ' ' + player.lastName) + ', ' + player.pos}
            </li>
            )
        return(
            <div>
                <div className='box-header'>Players</div>
                <ul className='players-list'>{playerList}</ul>
            </div>
        )
    }
}

class Player extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const player = this.props.data;
        console.log(player);
        const awards = player.awards ? player.awards.map(award => 
                <li key={award.type + award.season}>{award.type + ' (' + award.season + ')'}</li> 
            ) : null;
        return(                                                         
            <div className='player'>         
                <div className='box-header'>Player Info</div>
                <img 
                    src={player.imgURL}
                    alt={player.name}
                    className='player-photo'
                >
                </img>
                <div className='player-name'>
                    {player.name}
                </div>
                <div className='player-info'>
                        Position: {player.pos} <br/>
                        Age: {(new Date).getFullYear() - player.born.year} <br/>
                        Height: {Math.round(player.hgt * 2.54)}cm <br/>
                        Weight: {Math.round(player.weight * 0.453592)}kg <br/>
                        Bornplace: {player.born.loc} <br/>
                        Contract: {player.contract.amount * 1000}$ Exp: {player.contract.exp} <br/>
                        Draft {player.draft.year}: round {player.draft.round ? player.draft.round : '-'}, pick {player.draft.pick ? player.draft.pick : '-'} <br/>
                        From: {player.college} <br/>
                        Awards: {awards ? <ul>{awards}</ul> : '-'} <br/>
                        Prepared to play: {player.injury ? player.injury.type === 'Healthy' ? 'Yes' : 'Nope' + ' (Reason: ' + player.injury.type + ', games remaining: ' + player.injury.gamesRemaining + ')' : 'unknown'}
                </div>
            </div>
        )
    }

}

class Hint extends React.Component {
    constructor(props) {
        super(props);

        this.state = {              
            close: document.getElementById('hint').style.display === 'none' ? true : false
        }
    }

    
    handleClick() {
        this.state.close ? null : document.getElementById('hint').style.display = 'none';
    }
    render() {
        const division = {
            0: 'Atlantic',
            1: 'Central',
            2: 'Southeast',
            3: 'Southwest',
            4: 'Northwest',
            5: 'Pacific'
        }

        const team = this.props.data;
        const teamInfo = 
            <div>
                <span className='team-name'>{team.region + ' ' + team.name}</span> <br/>
                <hr/>
                <span className='tit'>Conference:</span> {team.cid ? 'West' : 'East'} <br/>
                <span className='tit'>Division:</span> {division[team.did]} <br/>
                <span className='tit'>City population:</span> {team.pop}m <br/>
                <span className='tit'>Stadium capacity:</span> {team.stadiumCapacity} <br/>
                <span className='tit'>Team strategy:</span> {team.strategy} <br/>
                <button className='close-button' onClick={() => this.handleClick()}>Close</button>              
            </div> 
        
        return(
            <div className='team-info'>
                {teamInfo}
            </div>   
        )
    }
}

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            value: e.target.value
        });    
    }
    handleClick(name) {
        const player = players.players.filter(player => player.name === name);
        console.log(player);
        ReactDOM.render(
            <Player data={player[0]} />,
            document.getElementById('player-info-container')
            )
    }

    createList(data) {
        ReactDOM.render(<PlayerList list={data} />,
            document.getElementById('player-container'))     
    }

    render() {
        const regexp = new RegExp(this.state.value, 'ig');
        const filteredList = this.props.data.players.filter((player) => 
            regexp.exec(player.name)
        );
        /*const playerList = this.state.value ? filteredList.map(player => <li 
                                                                            key={player.name + ' ' + player.born.year}
                                                                            onClick={() => this.handleClick(player.name)}
                                                                            >
                                                                            {player.name}
                                                                        </li>) : null;
                                                                        console.log(playerList);*/   //на случай если решу сделать выпадающий список из поиска
        return(
            <div>
                <form>
                    <input 
                        className='searchForm' 
                        name='searchForm' 
                        type='text' 
                        placeholder='Player search' 
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                </form>
                {this.state.value ? this.createList(filteredList) : null}  
            </div>
        )
    }           
}

//===============================                       ReactDOM.render(<PlayerList list={filteredList} />,
                                                    //document.getElementById('player-container'))
ReactDOM.render(
    <Team data={players} />,
    document.getElementById('team-container')
    );

ReactDOM.render(
    <Search data={players} />,
    document.getElementById('search')
    );