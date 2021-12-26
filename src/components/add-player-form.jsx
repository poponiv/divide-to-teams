import { Component } from "react";
import { Badge, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";

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
            addedPlayers: [],
            playerName: '',
            teams: initializeTeams(),
            level: 1
        };
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value});
    }

    handleAdd() {
        const addedPlayers = [...this.state.addedPlayers, {playerName: this.state.playerName, level: parseInt(this.state.level)}]
        addedPlayers.sort((a,b) => b.level - a.level);
        this.setState({
            addedPlayers,
            playerName: '',
            level: 1
        });
        
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
                <Row>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
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
                                <Button onClick={() => this.handleAdd()}>Add</Button>
                            </Col>
                            <Col xs="auto">
                                <Button variant="danger"  onClick={() => this.setTeams()}>Set Teams</Button>
                            </Col>
                        </Form.Group>
                        
                    </Form>
                </Row>

                <Row>
                    <Col xs={4}>
                        <Card style={{width: '18rem'}}>
                            <Card.Header>Available Players</Card.Header>
                            <ListGroup>
                                {this.state.addedPlayers.map((player) =>
                                        <ListGroup.Item as={"li"}>
                                            {player.playerName}
                                            <Badge>{player.level}</Badge>
                                        </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    </Col>
                </Row>
                <Row className="mt-5">
                    {this.state.teams.map((team) =>
                            <Col xs={4}>
                                <Card  style={{width: '18rem'}}>
                                    <Card.Header>{team.name}</Card.Header>
                                    <ListGroup>
                                    {team.players.map( (player) => 
                                    <ListGroup.Item>
                                        {player.playerName}
                                        <Badge>{player.level}</Badge>
                                    </ListGroup.Item>) }
                                    </ListGroup>
                                    <Card.Footer>Total: {team.totalLevel}</Card.Footer>
                                </Card>
                            </Col>
                        )}
                </Row>
            </Container>
        );
    }
}

export default AddPlayerForm;
