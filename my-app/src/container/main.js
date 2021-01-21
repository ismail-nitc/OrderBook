import React, { Component } from 'react';
import Table from '../components/table'

export default class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            table: "",
            tableData: []
        }
    }

    componentDidMount() {
        var connection = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        let msg = JSON.stringify({
            event: 'subscribe',
            channel: 'book',
            symbol: 'tBTCUSD'
        })

        connection.onopen = function () {
            connection.send(msg);
        };

        connection.onerror = function (error) {
            console.log('WebSocket Error ' + error);
        };

        let received = []
        connection.onmessage = (e) => {
            received.push(e.data)
            this.setState({ data: received })
            this.processData()
        };

        connection.onclose = function (event) {
            console.log("WebSocket is closed now.");
        };

        this.myTimmer = setInterval(async () => {
            if (this.state.table) {
                this.state.table.setData(this.state.tableData)
            }
        }, 1000)
    }

    startTimmer = () => {
        this.myTimmer = setInterval(async () => {
            if (this.state.table) {
                this.state.table.setData(this.state.tableData)
            }
        }, 1000)

    }

    processData = () => {
        const data = this.state.data
        let latestTwentyRows = []
        if (data && data.length > 0) {
            let j = 20
            for (let i = data.length; i >= 0, j >= 0; i--, j--)
                latestTwentyRows.push(data[i])
        }

        let tableData = []
        latestTwentyRows.map(el => {
            if (el && el.includes('[')) {
                let row = el.toString();
                row = row.replaceAll("[", "").replaceAll("]", "").split(',')
                tableData.push({
                    "price": row[1],
                    "count": row[2],
                    "amount": row[3]
                })
            }
        })

        this.setState({ tableData })
    }

    stopTimmer = () => {
        clearInterval(this.myTimmer)
    }


    componentWillUnmount() {
        clearInterval(this.myTimmer)
    }




    getTable = (table) => {
        this.setState({ table })
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }
        return (<div>
            <button type="button" class="btn btn-primary" onClick={() => this.startTimmer()}>Restart</button>
            <button type="button" class="btn btn-danger" onClick={() => this.stopTimmer()}>Stop</button>
            <br />
            <br />
            { this.state.tableData.length > 0 && <Table data={this.state.tableData} getTable={this.getTable} />}

        </div>);
    }
}