import { Component } from "react";
import { Badge, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";


function createPlayer(name, level) {
    return {playerName: name, level};
}

function initializeTeams() {
    return [
        {players: [], name: "Team 1", totalLevel: 0},
        {players: [], name: "Team 2", totalLevel: 0},
        {players: [], name: "Team 3", totalLevel: 0}
    ]
}

class AddPlayerForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numberOfTeams: 3,
            numberOfPlayersInTeam: 11,
            addedPlayers: [],
            playerName: '',
            teams: [],
            level: 1
        };
    }
    
    addRandomPlayers() {
        const addedPlayers = [];
        const iterations = this.state.numberOfTeams * this.state.numberOfPlayersInTeam;
        for (let i = 0; i < iterations; i++) {
            addedPlayers.push(createPlayer("Player " + i, Math.ceil(Math.random()*10)));
        }
        addedPlayers.sort((a,b) => b.level - a.level);
        this.setState({addedPlayers})
    }

    resetPlayers() {
        this.setState({teams: [], addedPlayers: []});
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    handleAdd() {
        const newPlayer = createPlayer(this.state.playerName, parseInt(this.state.level));
        const addedPlayers = [...this.state.addedPlayers, newPlayer];
        addedPlayers.sort((a,b) => b.level - a.level);
        this.setState({
            addedPlayers,
            playerName: '',
            level: 1
        });
        
    }

    deletePlayer(playerInd) {
        const addedPlayers = this.state.addedPlayers.slice();
        addedPlayers.splice(playerInd, 1);
        this.setState({addedPlayers})
    }

    setTeams() {
        const teams = initializeTeams();
        let orderOfInsertion = [0,1,2];
        for(let i = 0; i < this.state.addedPlayers.length; i+= 3) {
            const playersToInsert = this.state.addedPlayers.slice(i,i+3);
            console.log(playersToInsert.map((x) => x.level));
            for (let j = 0; j < playersToInsert.length; j++) {
                const nextTeam = teams[orderOfInsertion[j]];
                const nextPlayer = playersToInsert[j];
                nextTeam.players.push(nextPlayer);
                nextTeam.totalLevel += nextPlayer.level;
            }
            // in each cycle the order of insertion will be determined by the strength of the teams
            orderOfInsertion.sort( (a,b) => teams[a].totalLevel - teams[b].totalLevel);
        }
        this.setState({teams});
    }

    render() {
        return (
            <Container className="mt-3">
                <Form>
                    <Form.Group as={Row} className="mb-3">
                        <Row>
                            <Col xs="auto">
                                <Form.Control 
                                        name="playerName"
                                        placeholder="Player Name"
                                        type="text"
                                        value={this.state.playerName}
                                        onChange={(e) => this.handleUserInput(e)} />
                            </Col>
                            <Col xs="auto">
                                <Form.Control name="level"
                                            placeholder="Player Level"
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={this.state.level}
                                            onChange={(e) => this.handleUserInput(e)} />
                            </Col>
                            <Col xs="auto">
                                <Button variant="outline-primary" type="submit" onClick={(e) => {e.preventDefault(); this.handleAdd()}}>Add</Button>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col xs="auto">
                                <Button onClick={() => this.addRandomPlayers()}>Add Random Players</Button>
                            </Col>
                            <Col xs="auto">
                                <Button onClick={() => this.setTeams()}>Set Teams</Button>
                            </Col>
                            <Col xs="auto">
                                <Button variant="danger" onClick={() => this.resetPlayers()}>Reset Players</Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>

                <Row className="mt-4">
                    <Col xs={2}>
                        <Card>
                            <Card.Header>Available Players</Card.Header>
                            <ListGroup>
                                {this.state.addedPlayers.map((player, playerInd) =>
                                        <ListGroup.Item as={"li"} className="d-flex justify-content-between">
                                            <span className="align-items-start">
                                                {player.playerName}
                                                <Badge pill>{player.level}</Badge>
                                            </span>
                                            <span className="align-items-end">
                                                <Button as={Badge} bg="secondary" onClick={() => this.deletePlayer(playerInd)}>X</Button>
                                            </span>
                                        </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col xs={{span: 6, offset: 4}}>
                        <Row>
                        {this.state.teams.map((team) =>
                                <Col xs={"auto"}>
                                    <Card>
                                        <Card.Header>{team.name}</Card.Header>
                                        <ListGroup>
                                        {team.players.map( (player) => 
                                        <ListGroup.Item>
                                            {player.playerName}
                                            <Badge pill>{player.level}</Badge>
                                        </ListGroup.Item>) }
                                        </ListGroup>
                                        <Card.Footer>Total: {team.totalLevel}</Card.Footer>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default AddPlayerForm;
